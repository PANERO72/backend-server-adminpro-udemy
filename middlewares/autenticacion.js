var jwt = require("jsonwebtoken");

var SEED = require("../config/config").SEED;
//========================================================================
// Verificar el token
//========================================================================
exports.verificaToken = function(req,res, next) {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({
            ok: false,
            mensaje: "Token no válido.",
            errors: err
          });
      }
      req.usuario = decoded.usuario;
      next();
        // return res
        //   .status(201)
        //   .json({
        //     ok: false,
        //     mensaje: "todo correcto",
        //     decoded: decoded
        //   });
    });   
}
