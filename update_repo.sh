#!/bin/bash

# Đường dẫn đến repo
REPO_DIR="/var/jb/var/mobile/RepoJailbreak"
DEB_DIR="$REPO_DIR/debs"

# Tạo thư mục nếu chưa tồn tại
mkdir -p $DEB_DIR

# Chuyển đến thư mục repo
cd $REPO_DIR

# Xóa file Packages cũ
rm -f Packages Packages.gz Packages.bz2 Release

# Tạo file Packages mới
echo "Tạo Packages..."
dpkg-scanpackages -m ./debs > Packages

# Nén file Packages
echo "Tạo Packages.gz..."
gzip -c9 Packages > Packages.gz
bzip2 -c9 Packages > Packages.bz2

# Tạo file Release với các lệnh tương thích
echo "Tạo file Release..."
cat > Release << EOF
Origin: RepoJailbreak
Label: RepoJailbreak
Suite: stable
Version: 1.0
Codename: ios
Architectures: iphoneos-arm
Components: main
Description: Repo Jailbreak cá nhân
MD5Sum:
 $(md5sum Packages | cut -d' ' -f1) $(stat -f%z Packages) Packages
 $(md5sum Packages.gz | cut -d' ' -f1) $(stat -f%z Packages.gz) Packages.gz
 $(md5sum Packages.bz2 | cut -d' ' -f1) $(stat -f%z Packages.bz2) Packages.bz2
SHA1:
 $(sha1sum Packages | cut -d' ' -f1) $(stat -f%z Packages) Packages
 $(sha1sum Packages.gz | cut -d' ' -f1) $(stat -f%z Packages.gz) Packages.gz
 $(sha1sum Packages.bz2 | cut -d' ' -f1) $(stat -f%z Packages.bz2) Packages.bz2
SHA256:
 $(sha256sum Packages | cut -d' ' -f1) $(stat -f%z Packages) Packages
 $(sha256sum Packages.gz | cut -d' ' -f1) $(stat -f%z Packages.gz) Packages.gz
 $(sha256sum Packages.bz2 | cut -d' ' -f1) $(stat -f%z Packages.bz2) Packages.bz2
EOF

echo "👍️ Cập nhật xong repo tại: $REPO_DIR"