import express from 'express'
import controllers from '../controllers'

const router = express.Router()

router.get('/', controllers.user.get)
router.get('/:id', controllers.user.getUserByID)
router.post('/', controllers.user.create)

export default router
