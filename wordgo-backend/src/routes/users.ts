import { Request, Response } from "express";
import { userService } from "../services/userService";
import { aiService } from "../services/aiService";

const router = require("express").Router();

// POST /api/users/login - 登录/注册
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.body;
    const user = await userService.getOrCreate(username);
    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        level: user.level,
        totalXP: user.totalXP,
        streak: user.streak,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// GET /api/users/:id/stats - 获取用户学习统计
router.get("/:id/stats", async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await userService.getStats(req.params.id);
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// POST /api/users/:id/progress - 更新单词学习进度
router.post("/:id/progress", async (req: Request, res: Response): Promise<void> => {
  try {
    const { wordId, isCorrect } = req.body;
    await userService.updateProgress(req.params.id, wordId, Boolean(isCorrect));
    res.json({ success: true, message: "Progress updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// POST /api/users/:id/score - AI 发音评分
router.post("/:id/score", async (req: Request, res: Response): Promise<void> => {
  try {
    const { audio, targetWord } = req.body;
    const score = await aiService.scorePronunciation(Buffer.from(audio, "base64"), targetWord);
    res.json({ success: true, data: score });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;
