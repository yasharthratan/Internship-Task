# Standard_auth
Backend code for authentication-- login/signup/password reset with otp
authRoutes :
1. signup
URL : localhost:8000/signup
Method : POST
Request Body :
{
    "user" : "username",
    "email" : "user1@gmail.com",
    "pwd" : "12344566"
}
Header:-  Content-Type : application/json
Response :
If successfully posted :
{
    "msg": "signup successful"
}

If not a unique username :
{
    "msg": "username is already taken"
}

If there is an account with the given email :
{
    "msg": "There exists an account with the given email id"
}

2. login
URL : localhost:8000/login
Method : POST
Request Body : 
{
    "userId" : "username",
    "pwd" : "125697"
}
userId being username or email
Response :
If successfull :
{
    "msg": "Device verified"
}

JWT tokens appended to http cookies only
If no account with the given userId:
{
    "msg": "no user with given userId Aman1-Punekar"
}

If wrong password :
{
    "msg": "Wrong Password"
}

3. getOtp
URL : localhost:8000/getOtp
Method : POST
Request Body :
{
    "userId": "username"
}
userId being username or email

Header:-  Content-Type : application/json
Response :
If the given email or username doesn’t exist :
{
    "msg": "no user with given userId amanpunekar551@gmail.com1"
}
If succesful :
{
    "msg": "Otp sent to the registered email id"
}

Following email to the account linked 
The otp for the password change is 857396. The otp expires in 5 minutes

4. verifyOtpChangePassword
URL : localhost:8000/ verifyOtpChangePassword
Method : PUT
Request Body : 
{
        "userId" : "username",
        "otp" : "229355",
        "pwd" : "123456"

}

userId being username or email
Header:-  Content-Type : application/json
Response :
If password changed successfully
{
    "msg": "password changed successfully"
}

If wrong OTP : 
{
    "verification": false,
    "msg": "Incorrect OTP"
}

If otp expired :
{
    "msg": "OTP expired. Please try again"
}

5. logout
URL : localhost:8000/ logout
Method : DELETE
Request Body : Nothing
Response :
{
    message: "User signed out successfully",
}

