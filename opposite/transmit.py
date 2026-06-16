import sys
import os
from PIL import Image

def convert_png_to_jpeg(input_path):
    # 检查文件是否存在
    if not os.path.isfile(input_path):
        print(f"❌ 文件不存在: {input_path}")
        return False

    # 只处理 .png 结尾的文件
    if not input_path.lower().endswith('.png'):
        print(f"⚠️ 跳过非 PNG 文件: {input_path}")
        return False

    # 生成输出路径
    base = input_path[:-4]  # 去掉 .png
    output_path = base + '.jpeg'

    # 避免覆盖已有文件
    if os.path.exists(output_path):
        print(f"⏭️  已存在，跳过: {output_path}")
        return False

    try:
        img = Image.open(input_path)

        # 如果是 RGBA（透明通道），转成 RGB
        if img.mode in ('RGBA', 'LA', 'P'):
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = rgb_img

        img.save(output_path, 'JPEG', quality=90)
        print(f"✅ 转换成功: {output_path}")
        return True
    except Exception as e:
        print(f"❌ 转换失败: {input_path} -> {e}")
        return False

if __name__ == '__main__':
    # 如果没有传入参数，提示用法
    if len(sys.argv) < 2:
        print("用法: python transmit.py <图片.png> [<图片2.png> ...]")
        print("示例: python transmit.py big_small.png")
        print("      python transmit.py *.png")
        sys.exit(1)

    # 遍历所有传入的文件
    for arg in sys.argv[1:]:
        convert_png_to_jpeg(arg)
