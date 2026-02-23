const Student = require("../models/Student");
//admin only access
exports.getAllStudents = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden Access ! You dont have admin access" });
    }

    // const students = await Student.find({ role: "student", age: { $gte: 30 } }).select(
    //   "-password",
    // ); // select all fields except password and age greater than or equal to 
    


    // pagination
    const page=parseInt(req.query.page) || 1; // get page number from query params or default to 1
    const limit=parseInt(req.query.limit) || 10; // get limit from query params or default to 10

    const skipValue=(page-1)*limit // skip value for pagination 

    const students = await Student.find({ role: "student" }).sort({ age: 1 }).skip(skipValue).limit(limit);// select all fields except password and age greater than or equal to 30

    //aggregation 
    const result= await Student.aggregate([
      {
        $group:{
          _id:"$course",
          averarge:{
            $avg:"$age" // average age by course.can also doo  $sum $avg $min $max $diff

          }
        }
      }
    ]);

    res.status(200).json({students,
      averargeAgeByCourse: result
    });
  } catch (err) {
    //res.status(500).json({ error: err.message });
    next(err);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).select("-password"); // select all fields except password
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (err) {
    //res.status(500).json({ error: err.message });
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    // const student=await Student.findById(req.params.id);
    // if(!student){
    //     return res.status(404).json({message:'Student not found'});
    // }
    // if(req.user.role !=='admin' && req.user.id !== student._id){
    //     return res.status(403).json({message:'Forbidden Access ! You dont have admin access'});
    // };
    // const {name,email,age,course}=req.body;
    // if(name){
    //     student.name=name;
    // }
    // if(email){
    //     student.email=email;
    // }
    // if(age){
    //     student.age=age;
    // }
    // if(course){
    //     student.course=course;
    // }
    // await student.save();
    // const updatedStudent=await Student.findById(req.params.id).select('-password');
    // res.status(200).json({message:'Student updated successfully',updatedStudent});

    const studentId = req.params.id;
    const { name, email, age, course } = req.body;

    const student = await Student.findByIdAndUpdate(
      studentId,
      { name, email, age, course },
      { new: true, runValidators: true },
    ); // new:true returns the updated document

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully", student });
  } catch (err) {
    // res.status(500).json({ error: err.message });
    next(err);
  }
};


//delete student- admin only
exports.deleteStudent = async (req, res, next) => {
    try{
        if(req.user.role !=='admin'){
            return res.status(403).json({message:'Forbidden Access ! You dont have admin access'});
        }
        const studentId=req.params.id;
        const student=await Student.findByIdAndDelete(studentId);
        if(!student){
            return res.status(404).json({message:'Student not found'});
        }
        res.status(200).json({message:'Student deleted successfully'});
    }catch(err){
        // res.status(500).json({error:err.message});
        next(err);
    }
}