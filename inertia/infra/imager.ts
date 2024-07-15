export const ImagerURL = 'https://www.habbo.com.br/habbo-imaging/avatarimage'

export type ImagerParamsArguments = {
  img_format: 'png'
  user: string
  direction: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
  head_direction: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
  size: 's' | 'm' | 'g'
  action?: 'sit' | 'wav' | 'drk'
  headonly?: '0' | '1'
}
