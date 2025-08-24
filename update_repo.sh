#!/bin/bash
#
# update_repo.sh - Build repo Sileo/Cydia chuẩn
#

# --- Đường dẫn repo ---
REPO_DIR="$(pwd)"      # lấy thư mục hiện tại
DEB_DIR="$REPO_DIR/debs"

# --- Kiểm tra ---
if [[ ! -d "$DEB_DIR" ]]; then
    echo "❌ Không tìm thấy thư mục debs/. Hãy tạo: mkdir -p debs"
    exit 1
fi

# --- Xóa file cũ ---
rm -f "$REPO_DIR/Packages" "$REPO_DIR/Packages.gz" "$REPO_DIR/Packages.bz2" "$REPO_DIR/Release"

# --- Tạo Packages ---
echo "📦 Đang quét file .deb trong debs/..."
if [[ -z "$(ls -A "$DEB_DIR"/*.deb 2>/dev/null)" ]]; then
    echo "❌ Không có file .deb trong debs/"
    exit 1
fi

dpkg-scanpackages -m debs > "$REPO_DIR/Packages"
gzip -c9 "$REPO_DIR/Packages" > "$REPO_DIR/Packages.gz"
bzip2 -c9 "$REPO_DIR/Packages" > "$REPO_DIR/Packages.bz2"

# --- Sinh Release ---
echo "📝 Đang tạo Release..."
cat > "$REPO_DIR/Release" <<EOF
Origin: SileoJB
Label: SileoJB
Suite: stable
Codename: ios
Version: 1.0
Architectures: iphoneos-arm64
Components: main
Description: Repo Jailbreak cá nhân
EOF

# --- Thêm checksum ---
echo "" >> "$REPO_DIR/Release"
for f in Packages Packages.gz Packages.bz2; do
    [ -f "$REPO_DIR/$f" ] || continue
    echo "MD5Sum:" >> "$REPO_DIR/Release"
    md5sum "$REPO_DIR/$f" | awk '{printf " %s %d %s\n",$1,$2,"'$f'"}' >> "$REPO_DIR/Release"
    echo "SHA1:" >> "$REPO_DIR/Release"
    sha1sum "$REPO_DIR/$f" | awk '{printf " %s %d %s\n",$1,$2,"'$f'"}' >> "$REPO_DIR/Release"
    echo "SHA256:" >> "$REPO_DIR/Release"
    sha256sum "$REPO_DIR/$f" | awk '{printf " %s %d %s\n",$1,$2,"'$f'"}' >> "$REPO_DIR/Release"
    echo "" >> "$REPO_DIR/Release"
done

echo "✅ Repo đã build xong trong: $REPO_DIR"

