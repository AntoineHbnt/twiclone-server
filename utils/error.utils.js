module.exports.registerErrors = (err) => {
  let errors = {
    userAt: "",
    userPseudo: "",
    identifier: "",
    password: "",
  };

  if (err.message.includes("userAt"))
    errors.userAt = "Nom d'utilisateur incorrect";

  if (err.message.includes("userPseudo"))
    errors.userPseudo = "Votre pseudo doit contenir au minimum 6 caractères";

  if (err.message.includes("identifier"))
    errors.identifier = "L'identifiant (email / téléphone) est incorrect";

  if (err.message.includes("password"))
    errors.password = "Le mot de passe doit faire 6 caractères minimum";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("userAt"))
    errors.userAt = "Nom d'utilisateur déjà pris";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("identifier"))
    errors.identifier = "Cet identifiant (email / téléphone) est déjà pris";

  return errors;
};

module.exports.loginErrors = (err) => {
  let errors = { connectId: "", password: "" };
  console.log(err);

  if (err.message.includes("identifiant"))
    errors.connectId = "L'identifiant n'éxiste pas";
  if (err.message.includes("password"))
    errors.password = "Le mot de passe ne correspond pas";

  return errors;
};

module.exports.uploadErrors = (err) => {
  let errors = { format: "", maxSize: "" };

  if (err.message.includes("invalid file"))
    errors.format = "Format incompatabile";

  if (err.message.includes("max size"))
    errors.maxSize = "Le fichier est trop grand";

  return errors;
};
