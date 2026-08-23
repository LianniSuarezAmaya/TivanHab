import type { Mood } from "../../../ui/forms/types/forms.type"

export function  messageMood(level:Mood){
  if(level===1){
    return 'Not my best'
  }else if(level===2){
    return 'Slighty tired'
  }else if(level===3){
    return 'Moderately productive'
  }else if(level===4){
    return 'Very productive'
  }else{
    return 'On Fire'
  }
}