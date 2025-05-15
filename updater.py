
import os
import re
from pathlib import Path
import tkinter as tk
from tkinter import messagebox, filedialog
import shutil

class CardNewsUpdater:
    def __init__(self, master):
        self.master = master
        self.master.title("카드뉴스 자동 업데이트 도구")
        self.base_path = Path.cwd()

        self.label = tk.Label(master, text="카드뉴스 이미지를 선택하세요 (.jpg)")
        self.label.pack(pady=10)

        self.select_button = tk.Button(master, text="이미지 선택 및 등록", command=self.select_image)
        self.select_button.pack(pady=5)

    def select_image(self):
        file_path = filedialog.askopenfilename(filetypes=[("JPG files", "*.jpg")])
        if not file_path:
            return

        images_path = self.base_path / "images"
        share_path = self.base_path / "share"
        index_path = self.base_path / "index.html"
        template_path = share_path / "38.html"

        # 이미지 파일 이름 결정
        image_files = list(images_path.glob("*.jpg"))
        if not image_files:
            messagebox.showerror("오류", "images 폴더에 기존 이미지가 없습니다.")
            return

        new_number = max(int(f.stem) for f in image_files) + 1
        new_image_name = f"{new_number}.jpg"
        new_image_path = images_path / new_image_name

        # 이미지 복사
        shutil.copy(file_path, new_image_path)

        # index.html 수정
        with open(index_path, "r", encoding="utf-8") as f:
            content = f.read()
        updated_content = re.sub(r'const totalImages = \d+;', f'const totalImages = {new_number};', content)
        with open(index_path, "w", encoding="utf-8") as f:
            f.write(updated_content)

        # share/NN.html 생성
        with open(template_path, "r", encoding="utf-8") as f:
            template = f.read()
        new_html = template
        new_html = re.sub(r'/images/\d+\.jpg', f'/images/{new_number}.jpg', new_html)
        new_html = re.sub(r'/share/\d+\.html', f'/share/{new_number}.html', new_html)
        new_html = re.sub(r'\?img=\d+', f'?img={new_number}', new_html)

        new_html_path = share_path / f"{new_number}.html"
        with open(new_html_path, "w", encoding="utf-8") as f:
            f.write(new_html)

        messagebox.showinfo("성공", f"{new_number}.jpg 등록 완료!\nindex.html과 share/{new_number}.html도 수정됨.")

if __name__ == "__main__":
    root = tk.Tk()
    app = CardNewsUpdater(root)
    root.mainloop()
