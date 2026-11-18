---
name: verify-task
description: Lance la chaîne de vérification complète du projet (lint, typecheck, format, tests unitaires et d'intégration, build) et rapporte les échecs. À utiliser avant de déclarer une tâche du plan terminée.
disable-model-invocation: true
---

Exécuter dans l'ordre, en s'arrêtant au premier échec :

1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm format:check`
4. `pnpm test`
5. `pnpm test:int` — seulement si PostgreSQL tourne (`docker compose ps`) ; sinon le signaler, ne pas le lancer ni démarrer Docker sans accord.
6. `pnpm build`

Ne lancer ni `pnpm test:e2e` (navigateur : accord de l'utilisateur requis, commande à lui donner : `PW_CHANNEL=msedge pnpm test:e2e` après le build), ni aucune commande qui modifie des fichiers (`pnpm format`, `--fix`).

Rapport : une ligne par étape (OK, KO ou ignorée), puis pour la première étape en échec les 10 lignes d'erreur utiles. Ne pas corriger sans demande.
