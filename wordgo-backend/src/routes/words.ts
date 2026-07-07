import { Request, Response, NextFunction } from "express";
import { wordService } from "../services/wordService";
import { aiService } from "../services/aiService";

const router = require("express").Router();

// GET /api/words - 获取单词列表（分页/分类/搜索）
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const result = await wordService.getAll(page, limit, category, search);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// GET /api/words/categories - 获取所有分类
router.get("/categories", async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await wordService.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// GET /api/words/:id - 获取单个单词
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const word = await wordService.getById(req.params.id);
    if (!word) {
      res.status(404).json({ success: false, error: "Word not found" });
      return;
    }
    res.json({ success: true, data: word });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// POST /api/words/:word/tts - 语音合成
router.post("/:word/tts", async (req: Request, res: Response): Promise<void> => {
  try {
    const audio = await aiService.textToSpeech(req.params.word);
    res.json({ success: true, data: { audio } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;
