#!/bin/bash
set -euo pipefail

# Đường dẫn repo root
REPO="/var/jb/var/mobile/RepoJailbreak"

# Thông tin repo
ORIGIN="Romlayvn"
LABEL="Kho lưu trữ các tinh chỉnh jailbreak"
SUITE="stable"
CODENAME="ios"
DESC="Kho lưu trữ các tweak iOS"
ARCHS="iphoneos-arm64 iphoneos-arm"

# Tạo Packages & Packages.gz
dpkg-scanpackages -m "$REPO/debs" > "$REPO/Packages"
gzip -f -k "$REPO/Packages"

# Tạo Release
DATE="$(LC_ALL=C date -Ru)"
cat > "$REPO/Release" <<EOF
Origin: $ORIGIN
Label: $LABEL
Suite: $SUITE
Version: 1.0
Codename: $CODENAME
Architectures: $ARCHS
Components: main
Description: $DESC
Date: $DATE
Acquire-By-Hash: no
EOF

# Thêm checksum
add_hashes () {
  local algo="$1" header="$2"
  echo "$header:" >> "$REPO/Release"
  for f in Packages Packages.gz; do
    size=$(wc -c < "$REPO/$f" | tr -d ' ')
    hash=$(openssl "$algo" -r "$REPO/$f" | awk '{print $1}')
    printf " %s %s %s\n" "$hash" "$size" "$f" >> "$REPO/Release"
  done
}
add_hashes md5 MD5Sum
add_hashes sha1 SHA1
add_hashes sha256 SHA256

# Ký GPG (tùy chọn)
if gpg --list-keys >/dev/null 2>&1; then
  gpg --batch --yes --clearsign -o "$REPO/InRelease" "$REPO/Release"
  gpg --batch --yes -abs -o "$REPO/Release.gpg" "$REPO/Release"
fi

echo "✅ Repo đã được cập nhật tại $REPO"
