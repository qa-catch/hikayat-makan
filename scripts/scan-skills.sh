#!/usr/bin/env bash
# Audit T0 : balayage statique des skills (lecture seule, n'exécute rien).
# Usage : bash scripts/scan-skills.sh [--selftest | -v <skill>]
set -u
ROOTS=("$HOME/.claude/skills" "$HOME/.agents/skills")
NET='\bcurl\b|\bwget\b|Invoke-WebRequest|Invoke-RestMethod|fetch\(|requests\.|urllib|axios|http\.client|XMLHttpRequest|WebSocket'
EXE='npx |npm (i|install)|pip3? install|subprocess|os\.system|child_process|eval\(|exec\(|base64|powershell|Start-Process'
SEC='process\.env|os\.environ|getenv|\.env\b|credential|secret|api[_-]?key|token|\.ssh|\.aws'
HID='<!--|ignore (all |the )?(previous|above)|do not (tell|mention|reveal)|system prompt'
# Octets UTF-8 de U+200B-200F, U+202A-202E, U+2060-2064 (caractères invisibles / bidi)
INV='\xE2\x80[\x8B-\x8F\xAA-\xAE]|\xE2\x81[\xA0-\xA4]'

count() { grep -rIEil -- "$1" "$2" 2>/dev/null | wc -l; }
hash() { (cd "$1" && find -L . -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -c1-12); }

if [ "${1:-}" = "--selftest" ]; then
  # Vérifie que chaque motif détecte un cas connu (un motif corrompu renverrait 0 partout).
  t=$(mktemp -d); trap 'rm -rf "$t"' EXIT
  printf 'a\xe2\x80\x8bb\n' >"$t/inv.md"; printf 'tiret \xe2\x80\x94 seul\n' >"$t/dash.md"
  printf 'curl https://x\n' >"$t/net.md"; printf 'npx foo\n' >"$t/exe.md"
  printf 'process.env.X\n' >"$t/sec.md"; printf '<!-- x -->\n' >"$t/hid.md"
  ok=0
  for p in NET EXE SEC HID; do
    f=$(echo "$p" | tr 'A-Z' 'a-z')
    grep -rIEil -- "${!p}" "$t" | grep -q "$f.md" || { echo "ECHEC $p"; ok=1; }
  done
  r=$(LC_ALL=C grep -rIPl -- "$INV" "$t" | xargs -n1 basename | tr '\n' ' ')
  [ "$r" = "inv.md " ] || { echo "ECHEC INV : $r"; ok=1; }
  [ $ok = 0 ] && echo "selftest OK"
  exit $ok
fi

if [ "${1:-}" = "-v" ]; then
  for r in "${ROOTS[@]}"; do
    d="$r/$2"; [ -d "$d" ] || continue
    echo "## $d"
    for p in NET EXE SEC HID; do
      echo "--- $p"; grep -rIEin -- "${!p}" "$d" | cut -c1-220
    done
    echo "--- INV"; LC_ALL=C grep -rIPl -- "$INV" "$d"
  done
  exit 0
fi

printf '%-34s %-13s %-11s %5s %5s %4s %4s %4s %4s %4s\n' skill hash modifie fich scr net exe sec hid inv
for r in "${ROOTS[@]}"; do
  for d in "$r"/*/ "$r"/synced/*/*/; do
    [ -d "$d" ] || continue
    n=$(basename "$d"); [ "$n" = synced ] && continue
    case "$d" in */synced/*) b=$(basename "$(dirname "$d")"); n="synced:${b:0:4}/$n";; esac
    case "$r" in */.agents/*) n="agents/$n";; esac
    printf '%-34s %-13s %-11s %5s %5s %4s %4s %4s %4s %4s\n' "$n" "$(hash "$d")" \
      "$(find -L "$d" -type f -printf '%TY-%Tm-%Td\n' | sort | tail -1)" \
      "$(find -L "$d" -type f | wc -l)" \
      "$(find -L "$d" -type f \( -name '*.py' -o -name '*.sh' -o -name '*.js' -o -name '*.mjs' -o -name '*.ts' -o -name '*.ps1' \) | wc -l)" \
      "$(count "$NET" "$d")" "$(count "$EXE" "$d")" "$(count "$SEC" "$d")" "$(count "$HID" "$d")" \
      "$(LC_ALL=C grep -rIPl -- "$INV" "$d" 2>/dev/null | wc -l)"
  done
done
