const Customer = require('../models/Customer.js');
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
//magic link
const validator = require("validator");
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config();

class Guest {

	//Account Recovery
	async sendEmail(req, res){
        const senderEmail = process.env.NODEMAILER_EMAIL;
        const senderPassword = process.env.NODEMAILER_PASSWORD;

        const { email, magicLink } = req.body;

		const user = await Customer.findOne({ 
			username:email });
		
		if(!user){
			res.send({ ok: false,
				message: "username not found"})
		}

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            port: 465,
            secure: true,
            auth: {
              // TODO: replace `user` and `pass` values from <https://forwardemail.net>
              user: senderEmail,
              pass: senderPassword,
            },
        });
        // send mail with defined transport object
        try {
			if(!magicLink){
				const user = await Customer.findOneAndUpdate(
					{username:email}, 
					{MagicLink: uuidv4(), MagicLinkExpired: false}, 
					{returnDocument:'after'}
					);
				
				const URL = process.env.DOMAIN + '/sendEmail/';

				const info = await transporter.sendMail({
					from: senderEmail, // sender address
					to: email, // list of receivers
					subject: "Hello ✔", // Subject line
					text: "Hello world? Test1", // plain text body
					html: `<p>Hello friend and welcome back. This is your link to sign in to your account: ${URL}${email}/${user.MagicLink}'</p><p>Needless to remind you not to share this link with anyone 🤫</p>`, // html body
				});
		
				console.log("Message sent: %s", info.messageId);
				res.send({ok: false, message: "Link sent"})
				// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
		
				//
				// NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
				//       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
				//       <https://github.com/forwardemail/preview-email>
				//
			} else if(user.MagicLink == magicLink && !user.MagicLinkExpired){
				const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: "1h" }); //{expiresIn:'365d'}
				//set the variable to expired, and send back the token
				await Customer.findOneAndUpdate(
					{username:email}, 
					{MagicLinkExpired: true}
					)
				res.json({ ok: true, message: "Welcome back", token, email });
				}
        } catch (error) {
            res.send({ok: false, message: error})
        }
    }

	/*
	async findAllUsers(req, res){
		try{
			const user = await Customer.find({});
			res.send(user)
		}catch(e){
			res.send({e})
		}
	}
	*/

	async addGuest(req,res){
		//creat salt for the hash
		const salt = "321dsa"
		//import our params which we recieve from the client
		let {username: name, password: passName}=req.body
		try{
			//first find if the username is taken
			const user = await Customer.findOne({username: name});
			if (user) return res.json({ ok: false, message: "Username not available"});
			//next we will use validator
			if (!validator.isEmail(name))
				return res.json({ ok: false, message: "Invalid email provided" });
			const hash = await argon2.hash(passName, salt);
			const user_added = await Customer.create({
				username: name,
				password: hash,
			})
			const token = jwt.sign({ username: name, cart: []}, process.env.JWT_SECRET, {
				expiresIn: "1h",
				  });
			res.json({ok: true, message: "User successfully added", token})
		}
		catch(e){
			res.send({ok: false, e, message: "All fields required"});
			console.log(e);
		}
	}

	async delete (req, res){
		let { username: name } = req.body;
		try{
			const removed = await Customer.deleteOne({username: name});
			res.send({name});
		}
		catch(error){
			res.send({error})
		};
	}

	/*

	async getCart(req, res){
		let { username: name } = req.body;
		try{
		   const user = await Customer.findOne({username: name});
	       if(!user) res.send("cannot find user");
	       let currentCart = user.cart;
	       res.send(currentCart);

		}catch(error){
			res.send(error);
		}
	}
	*/

	async addItemToCart(req, res){
		let { username: name, product: prodObject} = req.body;
		try{
	
		   const user = await Customer.findOne({username: name});
		  
	       if(!user) res.send("cannot find user");
	       let newCart = user.cart;
		   //use a unique id on each cart item
	       prodObject.id = uuidv4();
	       newCart.push(prodObject);
	       const updatedUser = await Customer.updateOne(
	       	{username: name},
	       	{
	       		cart: newCart
	       	})
			//use a token to keep Mongodb and localStorage consistent
			const token = jwt.sign({ username: name, cart: newCart }, process.env.JWT_SECRET, {
				expiresIn: "1h",});
			res.json({token})
	    }
	    catch(error){
	        res.send({error});
	    };
	}

	async clearCart(req, res){
		let {username: name} = req.body;
		try{
		   const user = await Customer.findOne({username: name});
	       if(!user){res.send({ok:false, message:`cannot find user ${name}`});} 	       
			
		   await Customer.updateOne({username: name},{ cart: [] })
			
			//use a token to keep Mongodb and localStorage consistent
			const token = jwt.sign({ username: name, cart: [] }, process.env.JWT_SECRET, {
				expiresIn: "1h",});
			res.json({ok:true, message:'success', token})
			
		}catch(e){
			console.log(e);
			res.send({ok:false, message:"clear cart error"})}
	}

	async removeItemFromCart(req, res){
		let { username: name, id: prodId} = req.body;
		try{
	       const user = await Customer.findOne({username: name});
	       if(!user){
	       	res.send({ok:false, message:"cannot find user"});
	       } 
	       
		   let newCart = user.cart;
	       for(let i = 0; i < newCart.length; i++)
	       {
	       	if(String(newCart[i].id) === String(prodId)){
	       		newCart.splice(i, 1);
	       	}
	       }
	        await Customer.updateOne(
	       	{username: name},
	       	{
	       		cart: newCart
	       	})
			//use a token to keep Mongodb and localStorage consistent
			const token = jwt.sign({ username: name, cart: newCart }, process.env.JWT_SECRET, {
				expiresIn: "1h",});
	       res.json({ok: true, token});
	    }
	    catch(e){
	        res.send({ok: false, error: e});
	    };
	}

	async login(req, res){
		let {username: name, password: passName}=req.body
		try{
			const user = await Customer.findOne({username: name})
			if(!user) return res.json({ok:false, message:"User not found!"})
			const match = await argon2.verify(user.password, passName);
			if(match){
			//mongodb -> guest -> cart
			const user = await Customer.findOne({username: name});
			if(!user) res.send("cannot find user");
			let currentCart = user.cart;
			// 
	  		const token = jwt.sign({ username: user.username, cart: currentCart }, process.env.JWT_SECRET, {
	    	expiresIn: "1h",
	  		}); //{expiresIn:'365d'}
	  		// after we send the payload to the client you can see how to get it in the client's Login component inside handleSubmit function
	  		res.json({ ok: true, message: "login success", token});
			}else{
				res.json({ok:false,
				message:"incorrect password"})
			}
		}catch(e){
			res.send({e})
		}
	}

	async verifyToken(req, res){
		const token = req.headers.authorization;
		jwt.verify(token, process.env.JWT_SECRET, (err, succ) => {
			err
	  		  ? res.json({ ok: false, message: "Token is corrupted" })
	  		  : res.json({ ok: true, succ });
	});
	}
}

module.exports = new Guest()