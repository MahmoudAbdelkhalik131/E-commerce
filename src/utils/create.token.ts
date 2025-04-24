import JWT from "jsonwebtoken";
class CreateToken {
  createToken(id: any, role: string) {

    return JWT.sign({ _id:id, role:role }, process.env.JWT_KEY!, { expiresIn: '1d' });
  }
  createRestToken(id: any) {
    return JWT.sign({ _id:id }, process.env.JWT_RESET_KEY!, { expiresIn: '10m' });
  }
}
const Token = new CreateToken();
export default Token;
