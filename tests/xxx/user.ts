import {AVueAction} from "avuef";
import FlowSchema from "../flow-schema";
import {sha256} from "js-sha256";
import {API} from "../../api";

export default (a: AVueAction, f: FlowSchema) => ({
  async get(){
    setTimeout(()=>{
      API.account.GetUserConversations().catch(e=>{
        console.log(e)
      }).then(d=>{
        console.log({d})
      })
    },2000)

  },
  async "sign-in"(email, password) {
    let command = {
      email,
      password: sha256(sha256(password) + email)
    }
    let r = await API.login.SignIn(command)
      .catch(e => {
        console.warn(e)
      })
    if (r) {
      f.user.email(email)
      f.user.accessToken(r.accessToken)
    }
  }
})