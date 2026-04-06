-- ============================================
-- FONCTIONS ET VUES POUR LES RAPPORTS
-- ============================================

-- Vue: Rapport mensuel complet
CREATE OR REPLACE VIEW monthly_report AS
WITH period_payments AS (
    SELECT 
        p.id as period_id,
        COALESCE(SUM(pay.amount_usd), 0) as total_payments
    FROM periods p
    LEFT JOIN payments pay ON pay.date >= p.start_date AND pay.date <= p.end_date
    GROUP BY p.id
),
period_expenses AS (
    SELECT 
        p.id as period_id,
        COALESCE(SUM(e.amount_usd), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN e.category = 'SALLE' THEN e.amount_usd ELSE 0 END), 0) as room_expenses,
        COALESCE(SUM(CASE WHEN e.category != 'SALLE' THEN e.amount_usd ELSE 0 END), 0) as other_expenses
    FROM periods p
    LEFT JOIN expenses e ON e.period_id = p.id
    GROUP BY p.id
),
period_cults AS (
    SELECT 
        p.id as period_id,
        COUNT(c.id) as cults_count,
        COALESCE(SUM(c.cost), 0) as room_debt
    FROM periods p
    LEFT JOIN cults c ON c.period_id = p.id
    GROUP BY p.id
),
period_contributions AS (
    SELECT 
        p.id as period_id,
        COUNT(DISTINCT ec.member_id) as total_members,
        COALESCE(SUM(ec.amount_expected), 0) as total_expected,
        COALESCE(SUM(ec.amount_paid), 0) as total_paid,
        COUNT(CASE WHEN ec.status = 'PAID' THEN 1 END) as fully_paid_count,
        COUNT(CASE WHEN ec.status = 'PARTIAL' THEN 1 END) as partial_count,
        COUNT(CASE WHEN ec.status = 'PENDING' THEN 1 END) as pending_count
    FROM periods p
    LEFT JOIN expected_contributions ec ON ec.period_id = p.id
    GROUP BY p.id
)
SELECT 
    p.id,
    p.month,
    p.start_date,
    p.end_date,
    p.status,
    -- Paiements
    COALESCE(pp.total_payments, 0) as total_payments,
    -- Dépenses
    COALESCE(pe.total_expenses, 0) as total_expenses,
    COALESCE(pe.room_expenses, 0) as room_expenses,
    COALESCE(pe.other_expenses, 0) as other_expenses,
    -- Dette salle
    COALESCE(pc.cults_count, 0) as cults_count,
    COALESCE(pc.room_debt, 0) as room_debt,
    -- Calcul: nombre de cultes attendus (2 par semaine)
    CEIL((p.end_date - p.start_date + 1) / 7.0 * 2) as expected_cults_count,
    CEIL((p.end_date - p.start_date + 1) / 7.0 * 2) * 54 as expected_room_debt,
    -- Contributions
    COALESCE(pcon.total_members, 0) as total_members,
    COALESCE(pcon.total_expected, 0) as total_expected,
    COALESCE(pcon.total_paid, 0) as total_paid,
    COALESCE(pcon.fully_paid_count, 0) as fully_paid_count,
    COALESCE(pcon.partial_count, 0) as partial_count,
    COALESCE(pcon.pending_count, 0) as pending_count,
    -- Solde après paiement salle
    COALESCE(pp.total_payments, 0) - COALESCE(pc.room_debt, 0) as balance_after_room,
    -- Solde net (après toutes dépenses)
    COALESCE(pp.total_payments, 0) - COALESCE(pe.total_expenses, 0) - COALESCE(pc.room_debt, 0) as net_balance,
    -- Taux de recouvrement
    CASE 
        WHEN pcon.total_expected > 0 THEN (pcon.total_paid / pcon.total_expected * 100)
        ELSE 0 
    END as recovery_rate
FROM periods p
LEFT JOIN period_payments pp ON pp.period_id = p.id
LEFT JOIN period_expenses pe ON pe.period_id = p.id
LEFT JOIN period_cults pc ON pc.period_id = p.id
LEFT JOIN period_contributions pcon ON pcon.period_id = p.id;

COMMENT ON VIEW monthly_report IS 'Vue complète du rapport mensuel avec tous les calculs';

-- ============================================
-- FONCTION: Générer automatiquement les cultes d'une période
-- ============================================
CREATE OR REPLACE FUNCTION generate_period_cults(
    p_period_id UUID,
    p_cults_per_week INTEGER DEFAULT 2,
    p_cost_per_cult DECIMAL DEFAULT 54
)
RETURNS INTEGER AS $$
DECLARE
    v_period_record RECORD;
    v_current_date DATE;
    v_cults_generated INTEGER := 0;
    v_cults_per_week INTEGER;
BEGIN
    -- Get period details
    SELECT * INTO v_period_record FROM periods WHERE id = p_period_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Période non trouvée';
    END IF;
    
    -- Check if cults already exist
    IF EXISTS (SELECT 1 FROM cults WHERE period_id = p_period_id) THEN
        -- Delete existing cults for regeneration
        DELETE FROM cults WHERE period_id = p_period_id;
    END IF;
    
    v_current_date := v_period_record.start_date;
    
    -- Generate cults for the entire period
    WHILE v_current_date <= v_period_record.end_date LOOP
        -- Calculate which day of the week (0=Sunday, 3=Wednesday)
        -- Default: Sunday (0) and Wednesday (3) for 2 cults per week
        
        -- Insert Sunday cult
        IF EXTRACT(DOW FROM v_current_date) = 0 THEN
            INSERT INTO cults (period_id, date, cost, currency, description)
            VALUES (p_period_id, v_current_date, p_cost_per_cult, 'USD', 'Culte de dimanche');
            v_cults_generated := v_cults_generated + 1;
        END IF;
        
        -- Insert Wednesday cult (if 2 per week)
        IF p_cults_per_week >= 2 AND EXTRACT(DOW FROM v_current_date) = 3 THEN
            INSERT INTO cults (period_id, date, cost, currency, description)
            VALUES (p_period_id, v_current_date, p_cost_per_cult, 'USD', 'Culte de mercredi');
            v_cults_generated := v_cults_generated + 1;
        END IF;
        
        -- Insert Friday cult (if 3 per week)
        IF p_cults_per_week >= 3 AND EXTRACT(DOW FROM v_current_date) = 5 THEN
            INSERT INTO cults (period_id, date, cost, currency, description)
            VALUES (p_period_id, v_current_date, p_cost_per_cult, 'USD', 'Culte de vendredi');
            v_cults_generated := v_cults_generated + 1;
        END IF;
        
        v_current_date := v_current_date + 1;
    END LOOP;
    
    RETURN v_cults_generated;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_period_cults IS 'Génère automatiquement les cultes pour une période (2 par semaine par défaut)';

-- ============================================
-- FONCTION: Calculer le nombre de cultes attendus
-- ============================================
CREATE OR REPLACE FUNCTION calculate_expected_cults(
    p_start_date DATE,
    p_end_date DATE,
    p_cults_per_week INTEGER DEFAULT 2
)
RETURNS INTEGER AS $$
DECLARE
    v_weeks DECIMAL;
BEGIN
    v_weeks := CEIL((p_end_date - p_start_date + 1) / 7.0);
    RETURN (v_weeks * p_cults_per_week)::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Auto-generate cults when period is created
-- ============================================
CREATE OR REPLACE FUNCTION auto_generate_cults_on_period()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate cults for the new period (2 per week, 54 USD each)
    PERFORM generate_period_cults(NEW.id, 2, 54);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enable auto-generation (optional - remove comment to enable)
-- CREATE TRIGGER auto_generate_cults
--     AFTER INSERT ON periods
--     FOR EACH ROW
--     EXECUTE FUNCTION auto_generate_cults_on_period();

-- ============================================
-- Vue: Détail des retardataires avec priorisation salle
-- ============================================
CREATE OR REPLACE VIEW late_payments_detail AS
SELECT 
    ec.id,
    m.name as member_name,
    m.email,
    d.name as department_name,
    p.month,
    ec.amount_expected,
    ec.amount_paid,
    (ec.amount_expected - ec.amount_paid) as remaining,
    ec.status,
    CASE 
        WHEN ec.status = 'PENDING' THEN 'Non payé'
        WHEN ec.status = 'PARTIAL' THEN 'Partiel'
        ELSE 'Payé'
    END as status_label,
    -- Priority: room must be paid first
    EXISTS (
        SELECT 1 FROM cults c 
        WHERE c.period_id = ec.period_id 
        HAVING SUM(c.cost) > COALESCE(
            (SELECT SUM(pay.amount_usd) 
             FROM payments pay 
             JOIN payment_allocations pa ON pa.payment_id = pay.id
             WHERE pa.expected_contribution_id = ec.id), 0
        )
    ) as room_not_paid
FROM expected_contributions ec
JOIN members m ON m.id = ec.member_id
JOIN departments d ON d.id = ec.department_id
JOIN periods p ON p.id = ec.period_id
WHERE ec.status IN ('PENDING', 'PARTIAL')
ORDER BY p.month DESC, m.name;

COMMENT ON VIEW late_payments_detail IS 'Détail des paiements en retard avec indicateur de priorité salle';

-- ============================================
-- Vue: Analyse par département avec taux de recouvrement
-- ============================================
CREATE OR REPLACE VIEW department_analysis AS
SELECT 
    d.id,
    d.name,
    d.contribution_type,
    COUNT(DISTINCT md.member_id) as member_count,
    COUNT(DISTINCT ec.id) as total_contributions,
    COALESCE(SUM(ec.amount_expected), 0) as total_expected,
    COALESCE(SUM(ec.amount_paid), 0) as total_received,
    CASE 
        WHEN SUM(ec.amount_expected) > 0 
        THEN ROUND((SUM(ec.amount_paid) / SUM(ec.amount_expected) * 100), 2)
        ELSE 0 
    END as recovery_rate,
    COUNT(CASE WHEN ec.status = 'PAID' THEN 1 END) as paid_count,
    COUNT(CASE WHEN ec.status = 'PARTIAL' THEN 1 END) as partial_count,
    COUNT(CASE WHEN ec.status = 'PENDING' THEN 1 END) as pending_count
FROM departments d
LEFT JOIN member_departments md ON md.department_id = d.id
LEFT JOIN expected_contributions ec ON ec.department_id = d.id
GROUP BY d.id, d.name, d.contribution_type;

COMMENT ON VIEW department_analysis IS 'Analyse des contributions par département';

