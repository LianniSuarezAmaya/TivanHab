export type Nothe={
  key:number,
  title:string,
  content?:string
}

export interface NotheCardProps{
  nothe:Nothe
}
export interface NotheListProps{
  nothes:Nothe[]
}

export type NotheFormType={
  key?:number,
  title:string,
  content?:string
}

export type UnsavedNothe={
  title:string,
  content?:string
}