import userService from "../service/user-service.js";

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  };
};

const getUser = async (req, res, next) => {
  try {
    const email = req.user.email;
    const result = await userService.getUser(email);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const email = req.user.email;
    await userService.logoutUser(email);

    res.status(200).json({
      status: "OK",
    });
  } catch (error) {
    next(error)
  }
};

export default { 
  register,
  login,
  getUser, 
  logoutUser,
};