##  A
flow graph schema builder const based on alak library
####   f: AVueFlow 
 A.f
 create base flow
 same as flow
####   flow: AVueFlow 
 A.flow
 create base flow
 same as f
####   on: (parentFlowPath: string, actionPath: string) => AFlow<any> 
 A.on
 create edge flow
 when update parent flow node call action with parent flow data and set returned data from action as current flow
 `parentFlowPath` - path to parent flow node
 `actionPath` - path to called action
####   lazyOn: (parentFlowPath: string, actionPath: string) => AFlow<any> 
 `A.lazyOn`
 create edge if current flow used in vue templates
 when update parent flow node call action with parent flow data and set returned data from action as current flow
 `parentFlowPath` - path to parent flow node
 `actionPath` - path to called action
####   get: (actionPath: string) => AFlow<any> 
 `A.get`
 create flow from returned action data
####   lazyGet: (actionPath: string) => AFlow<any> 
 `A.lazyGet`
 create flow from returned action data
 if current flow used in vue templates
##  $f
 component prototype parameter for mutate flow graph store
####   (flowPath: string, value: any): void 
 silent mutation without notify child edges/listeners in flow graph
 just update state for ui components
 `$f("someModule.firstFlow", {v:true,data:0})`
####   [metaParam: string]: AFlow<any> 
 mutate and notify all edges/nodes/listeners in flow graph
 `$f.someModule.firstFlow({v:true,data:0})`
 or get value
 `$f.someModule.firstFlow.v`
##  $a
 component prototype parameter for access global state and launch actions and more
####   launch(actionPath: string, ...args): Promise<any> | any 
 Call action by path with argument
####   state: { [flowName: string]: any } 
 Global store for nodes with params `state` in flow graph schema
####   during: { [actionPath: string]: boolean } 
 Progress boolean state for any action by same path
##  Vue Component Options

####     mapFlow?: { [propNameOrModuleName: string]: string[] | string } 
 map flow data to component state property
 @example
 ```
 mapFlow:{
  "isOpen": "module1.openExitDialog"
 }
 ```
 map grouped property form module with same name
 
 ```
 mapFlow:{
  "module1": ["openExitDialog","username], //map selected properties
  "module2": [] //map all properties
 }
 ```
####     onFlow?: { [flowPath: string]: (...dataValues) => void } 
 listen flow
 @example
 ```
 onFlow:{
  "module1.username"(v){
     this.username = v.toUpperCase()
     // ... just do something with v flow data value
  }
 }
 ```
