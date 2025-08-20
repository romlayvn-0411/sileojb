#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# —— CẤU HÌNH REPO —— 
# Bạn có thể tùy chỉnh các biến sau theo ý muốn
REPO_DIR="${1:-/var/jb/var/mobile/RepoJailbreak}"
ORIGIN="Romlayvn"
LABEL="Kho lưu trữ các tinh chỉnh jailbreak"
SUITE="stable"
VERSION="1.0"
CODENAME="ios"
ARCHS="iphoneos-arm64 iphoneos-arm"
COMPONENTS="main"
DESCRIPTION="Kho lưu trữ các tweak iOS"

# —— Kiểm tra sự tồn tại của thư mục và debs/ —— 
if [[ ! -d "$REPO_DIR/debs" ]]; then
  echo "❌ Thư mục debs/ không tồn tại tại $REPO_DIR. Vui lòng tạo và thêm .deb vào đó."
  exit 1
fi

# —— Chuyển vào thư mục repo —— 
cd "$REPO_DIR"

# —— Bước 1: Tạo Packages và nén Packages.gz —— 
echo "› Tạo Packages…"
dpkg-scanpackages -m ./debs > Packages

echo "› Tạo Packages.gz…"
gzip -f -k Packages

# —— Bước 2: Tạo file Release —— 
# Sử dụng ngày theo chuẩn RFC2822 để APT nhận đúng
DATE="$(LC_ALL=C date '+%a, %d %b %Y %H:%M:%S %z')"

cat > Release <<EOF
Origin: $ORIGIN
Label: $LABEL
Suite: $SUITE
Version: $VERSION
Codename: $CODENAME
Architectures: $ARCHS
Components: $COMPONENTS
Description: $DESCRIPTION
Date: $DATE
Acquire-By-Hash: no
EOF

# —— Bước 3: Thêm checksum vào Release —— 
echo "› Tính toán checksum…"
add_hashes() {
  local algo=$1 header=$2
  echo "$header:" >> Release
  for file in Packages Packages.gz; do
    local path="$REPO_DIR/$file"
    local size=$(wc -c < "$path" | tr -d ' ')
    local sum=$(openssl "$algo" -r "$path" | awk '{print $1}')
    printf " %s %s %s\n" "$sum" "$size" "$file" >> Release
  done
}

add_hashes md5 MD5Sum
add_hashes sha1 SHA1
add_hashes sha256 SHA256

# —— Bước 4: Ký GPG (tùy chọn) —— 
if command -v gpg >/dev/null 2>&1 && gpg --list-keys >/dev/null 2>&1; then
  echo "› Ký InRelease và Release.gpg…"
  gpg --batch --yes --clearsign -o InRelease Release
  gpg --batch --yes -abs -o Release.gpg Release
fi

echo "✅ Đã cập nhật xong repo tại: $REPO_DIR"
