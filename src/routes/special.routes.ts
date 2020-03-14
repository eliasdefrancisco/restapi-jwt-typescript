import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('Success')
})

export default router