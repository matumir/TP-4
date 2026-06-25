const express = require("express");


const router = express.Router();


const { House, User } = require("../models");




router.get("/user/:id", async(req,res)=>{


    try{


        const userId = req.params.id;



        const user = await User.findByPk(


            userId,


            {


                include: [

                    {

                        model: House,

                        as: "houses"

                    }

                ]


            }


        );




        if(!user){


            return res.status(404).json({


                message:"Usuario no encontrado"


            });


        }




        res.json(user.houses);




    }catch(error){


        console.log(error);


        res.status(500).json({


            error:error.message


        });



    }



});




module.exports = router;