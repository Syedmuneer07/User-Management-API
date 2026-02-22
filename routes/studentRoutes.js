const  express=require('express');
const router=express.Router();
const authMiddleware=require('../middleware/authMiddleware');
const {getAllStudents,getStudent, updateStudent, deleteStudent}=require('../controllers/studentController');


router.get('/',authMiddleware,getAllStudents);
router.get('/:id',authMiddleware,getStudent);
router.put('/:id',authMiddleware,updateStudent);
router.delete('/:id',authMiddleware,deleteStudent);

module.exports=router;
