import { Router } from "express";
import FlowerController from "../controllers/FlowersController.js"; // Alteração para FlowerController

const router = Router();

// CRUD para flores
router.post('/', FlowerController.addflower); // Criar flor
router.get('/:id', FlowerController.getflower); // Ler uma flor específica
router.get('/', FlowerController.getflowers); // Ler todas as flores
router.put('/:id', FlowerController.updateflower); // Atualizar flor
router.delete('/:id', FlowerController.deleteflower); // Deletar flor

export default router;
