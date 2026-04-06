-- ============================================
-- REFONTE COMPLÈTE - MIGRATION CRITIQUE
-- Ajout des liens période et tracking salle
-- ============================================

-- ============================================
-- ÉTAPE 1: Ajouter period_id à payments
-- ============================================
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS period_id UUID REFERENCES periods(id) ON DELETE SET NULL;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_payments_period_id ON payments(period_id);

COMMENT ON COLUMN payments.period_id IS 'Lien vers la période du paiement';

-- ============================================
-- ÉTAPE 2: Ajouter flag is_room_payment
-- ============================================
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS is_room_payment BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_payments_is_room ON payments(is_room_payment) 
WHERE is_room_payment = TRUE;

COMMENT ON COLUMN payments.is_room_payment IS 'TRUE si ce paiement est pour la dette de salle';

-- ============================================
-- ÉTAPE 3: Créer table room_contributions
-- ============================================
CREATE TABLE IF NOT EXISTS room_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    amount_usd DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT DEFAULT 'Contribution dette de salle',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(member_id, period_id, payment_id)
);

COMMENT ON TABLE room_contributions IS 'Tracking des paiements de dette de salle par membre et période';

-- Index pour requêtes rapides
CREATE INDEX IF NOT EXISTS idx_room_contrib_member ON room_contributions(member_id);
CREATE INDEX IF NOT EXISTS idx_room_contrib_period ON room_contributions(period_id);
CREATE INDEX IF NOT EXISTS idx_room_contrib_payment ON room_contributions(payment_id);

-- ============================================
-- ÉTAPE 4: Mettre à jour les paiements existants
-- ============================================
-- Lier les paiements existants à leur période basée sur la date
UPDATE payments p
SET period_id = (
    SELECT id 
    FROM periods 
    WHERE p.date BETWEEN start_date AND end_date
    LIMIT 1
)
WHERE period_id IS NULL;

-- ============================================
-- ÉTAPE 5: Créer vue pour calcul des parts de salle
-- ============================================
CREATE OR REPLACE VIEW room_debt_per_member AS
WITH period_stats AS (
    SELECT 
        p.id as period_id,
        COUNT(DISTINCT ec.member_id) as active_contributors,
        COALESCE(SUM(c.cost), 0) as total_room_debt
    FROM periods p
    LEFT JOIN expected_contributions ec ON ec.period_id = p.id
    LEFT JOIN cults c ON c.period_id = p.id
    GROUP BY p.id
)
SELECT 
    ps.period_id,
    m.id as member_id,
    m.name as member_name,
    ps.total_room_debt,
    ps.active_contributors,
    CASE 
        WHEN ps.active_contributors > 0 
        THEN ps.total_room_debt / ps.active_contributors 
        ELSE 0 
    END as member_share,
    COALESCE(SUM(rc.amount_usd), 0) as paid_amount,
    CASE 
        WHEN ps.active_contributors > 0 
        THEN (ps.total_room_debt / ps.active_contributors) - COALESCE(SUM(rc.amount_usd), 0)
        ELSE 0 
    END as remaining
FROM period_stats ps
CROSS JOIN members m
LEFT JOIN room_contributions rc ON rc.period_id = ps.period_id AND rc.member_id = m.id
WHERE m.is_active = TRUE
GROUP BY ps.period_id, m.id, m.name, ps.total_room_debt, ps.active_contributors;

COMMENT ON VIEW room_debt_per_member IS 'Calcule la part de dette de salle pour chaque membre par période';

-- ============================================
-- ÉTAPE 6: Fonction pour générer automatiquement les parts de salle
-- ============================================
CREATE OR REPLACE FUNCTION calculate_member_room_debt(
    p_member_id UUID,
    p_period_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
    v_total_debt DECIMAL;
    v_contributors INTEGER;
    v_member_share DECIMAL;
BEGIN
    -- Get total room debt for period
    SELECT COALESCE(SUM(cost), 0) INTO v_total_debt
    FROM cults
    WHERE period_id = p_period_id;
    
    -- Count active contributors
    SELECT COUNT(DISTINCT member_id) INTO v_contributors
    FROM expected_contributions
    WHERE period_id = p_period_id;
    
    -- Calculate share
    IF v_contributors > 0 THEN
        v_member_share := v_total_debt / v_contributors;
    ELSE
        v_member_share := 0;
    END IF;
    
    RETURN v_member_share;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ÉTAPE 7: Vue complète du rapport financier (CORRIGÉE)
-- ============================================
CREATE OR REPLACE VIEW monthly_report_complete AS
WITH period_payments AS (
    SELECT 
        period_id,
        COALESCE(SUM(amount_usd), 0) as total_payments,
        COALESCE(SUM(CASE WHEN is_room_payment = TRUE THEN amount_usd ELSE 0 END), 0) as room_payments,
        COALESCE(SUM(CASE WHEN is_room_payment = FALSE THEN amount_usd ELSE 0 END), 0) as contrib_payments
    FROM payments
    WHERE period_id IS NOT NULL
    GROUP BY period_id
),
period_room_contrib AS (
    SELECT 
        period_id,
        COALESCE(SUM(amount_usd), 0) as total_room_contributions
    FROM room_contributions
    GROUP BY period_id
),
period_expenses AS (
    SELECT 
        period_id,
        COALESCE(SUM(amount_usd), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN category = 'SALLE' THEN amount_usd ELSE 0 END), 0) as room_expenses,
        COALESCE(SUM(CASE WHEN category != 'SALLE' THEN amount_usd ELSE 0 END), 0) as other_expenses
    FROM expenses
    GROUP BY period_id
),
period_cults AS (
    SELECT 
        period_id,
        COUNT(*) as cults_count,
        COALESCE(SUM(cost), 0) as room_debt
    FROM cults
    GROUP BY period_id
),
period_contributions AS (
    SELECT 
        period_id,
        COUNT(DISTINCT member_id) as total_members,
        COALESCE(SUM(amount_expected), 0) as total_expected,
        COALESCE(SUM(amount_paid), 0) as total_paid
    FROM expected_contributions
    GROUP BY period_id
)
SELECT 
    p.id,
    p.month,
    p.start_date,
    p.end_date,
    p.status,
    -- Paiements
    COALESCE(pp.total_payments, 0) as total_payments,
    COALESCE(pp.room_payments, 0) as room_payments,
    COALESCE(pp.contrib_payments, 0) as contrib_payments,
    -- Contributions salle
    COALESCE(prc.total_room_contributions, 0) as room_contributions,
    -- Dépenses
    COALESCE(pe.total_expenses, 0) as total_expenses,
    COALESCE(pe.room_expenses, 0) as room_expenses,
    COALESCE(pe.other_expenses, 0) as other_expenses,
    -- Dette salle
    COALESCE(pc.cults_count, 0) as cults_count,
    COALESCE(pc.room_debt, 0) as room_debt,
    -- Calculs
    CEIL((p.end_date - p.start_date + 1) / 7.0 * 2) as expected_cults_count,
    -- Solde après paiement salle (prioritaire)
    COALESCE(pp.total_payments, 0) - COALESCE(pc.room_debt, 0) as balance_after_room,
    -- Solde net
    COALESCE(pp.total_payments, 0) - COALESCE(pe.total_expenses, 0) - COALESCE(pc.room_debt, 0) as net_balance,
    -- Couverture salle
    CASE 
        WHEN COALESCE(pp.total_payments, 0) >= COALESCE(pc.room_debt, 0) 
        THEN TRUE 
        ELSE FALSE 
    END as room_covered,
    -- Déficit salle
    GREATEST(0, COALESCE(pc.room_debt, 0) - COALESCE(pp.total_payments, 0)) as room_deficit,
    -- Stats contributions
    COALESCE(pcon.total_members, 0) as contributors_count,
    COALESCE(pcon.total_expected, 0) as total_expected,
    COALESCE(pcon.total_paid, 0) as total_contributions_paid,
    -- Taux recouvrement
    CASE 
        WHEN pcon.total_expected > 0 
        THEN ROUND((pcon.total_paid / pcon.total_expected * 100), 2)
        ELSE 0 
    END as recovery_rate
FROM periods p
LEFT JOIN period_payments pp ON pp.period_id = p.id
LEFT JOIN period_room_contrib prc ON prc.period_id = p.id
LEFT JOIN period_expenses pe ON pe.period_id = p.id
LEFT JOIN period_cults pc ON pc.period_id = p.id
LEFT JOIN period_contributions pcon ON pcon.period_id = p.id;

COMMENT ON VIEW monthly_report_complete IS 'Vue complète et corrigée du rapport mensuel';

-- ============================================
-- ÉTAPE 8: Données de test pour validation
-- ============================================
-- Insérer taux de change si vide
INSERT INTO exchange_rates (currency, rate_to_usd) 
VALUES 
    ('USD', 1.0),
    ('EUR', 1.08),
    ('GBP', 1.27),
    ('TRY', 0.032)
ON CONFLICT (currency) DO NOTHING;

