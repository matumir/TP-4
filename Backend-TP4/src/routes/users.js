const express = require("express");

const router = express.Router();

const { User } = require("../models");



router.post("/login", async (req,res)=>{


    try{


        const {username,password} = req.body;



        const user = await User.findOne({

            where:{
                username
            }

        });



        if(!user){

            return res.status(404).json({

                message:"Usuario no encontrado"

            });

        }



        if(user.password !== password){

            return res.status(401).json({

                message:"Contraseña incorrecta"

            });

        }



        res.json({

            message:"Login correcto",

            user:{

                id:user.id,

                username:user.username

            }

        });



    }catch(error){


        res.status(500).json({

            error:error.message

        });


    }


});



module.exports = router;