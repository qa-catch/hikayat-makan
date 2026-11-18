# CI et protection de `main` (T8)

Workflow : `.github/workflows/ci.yml` (job **Contrôles** : lint, typecheck, format, tests, tests d'intégration, build, e2e). Toutes les actions sont épinglées par SHA ; Dependabot (`.github/dependabot.yml`) propose les mises à jour.

## Réglages du dépôt (appliqués le 2026-11-18)

Dépôt `qa-catch/hikayat-makan`, **public** : sur un dépôt privé en plan gratuit, GitHub refuse la protection de branche (HTTP 403). Commandes appliquées après le premier run vert de la CI (remplacer `OWNER/REPO` pour les rejouer) :

```bash
# Protection de main : contrôle obligatoire, branche à jour, pas de push direct, admins inclus.
gh api -X PUT repos/OWNER/REPO/branches/main/protection --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["Contrôles", "gitleaks"] },
  "enforce_admins": true,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON

# Alertes de dépendances et correctifs de sécurité automatiques.
gh api -X PUT repos/OWNER/REPO/vulnerability-alerts
gh api -X PUT repos/OWNER/REPO/automated-security-fixes
```

Les noms de `contexts` doivent être ceux affichés par GitHub (nom du job : `Contrôles`, `gitleaks`).

## Test d'acceptation

Ouvrir une PR qui casse volontairement un contrôle (ex. une variable inutilisée → `pnpm lint`) : la fusion doit être bloquée.
