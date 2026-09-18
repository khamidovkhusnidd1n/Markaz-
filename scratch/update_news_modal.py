import re
with open("c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/components/NewsModal.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace selectedImage with selectedImageIndex
content = content.replace("const [selectedImage, setSelectedImage] = useState<string | null>(null);",
                          "const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);")

# Replace escape key logic
content = content.replace("if (e.key === 'Escape' && !selectedImage) onClose();",
                          "if (e.key === 'Escape' && selectedImageIndex === null) onClose();")

content = content.replace("selectedImage]", "selectedImageIndex]")

# Replace onClick for main image
content = content.replace("onClick={() => allImages[0] && setSelectedImage(getImageUrl(allImages[0]))}",
                          "onClick={() => allImages.length > 0 && setSelectedImageIndex(0)}")

# Replace onClick for gallery images
content = content.replace("onClick={() => setSelectedImage(getImageUrl(img))}",
                          "onClick={() => setSelectedImageIndex(idx + 1)}")

# Replace ImageModal usage
content = re.sub(r'<ImageModal\s*imageUrl=\{selectedImage \|\| \'\'\}\s*isOpen=\{!!selectedImage\}\s*onClose=\{.*?\}\s*/>',
                 r'<ImageModal \n        images={allImages.map(img => getImageUrl(img))}\n        initialIndex={selectedImageIndex !== null ? selectedImageIndex : 0}\n        isOpen={selectedImageIndex !== null}\n        onClose={() => setSelectedImageIndex(null)}\n      />',
                 content, flags=re.DOTALL)

with open("c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/components/NewsModal.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated NewsModal")
