# LittleX Frontend

基於 Vite + React + TypeScript + Tailwind CSS 的前端專案。

## 功能概覽
- 登入 / 登出
- Explore 貼文串流（追隨者 + 隨機貼文）
- 個人頁 / 他人頁
- 貼文按讚、留言、分享
- 單篇貼文頁
- 使用者搜尋、追隨建議

## 環境需求
- Node.js 18+
- npm 9+

## 安裝與啟動
```bash
npm install
npm run dev
```

## 指令
- `npm run dev`：開發模式
- `npm run build`：建置
- `npm run preview`：預覽建置結果


## 專案結構
```
src/
  api/          # API client 與 endpoint 包裝
  components/   # 共用元件
  hooks/        # 自訂 hooks
  pages/        # 頁面
  utils/        # token/user/時間等工具
```

## 備註
- 登入後 token 會存於 `localStorage` (`littlex_token`)
- 使用者資料存於 `localStorage` (`littlex_user`)
