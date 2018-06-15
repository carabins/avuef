##  A
flow graph schema builder const based on alak library
####   f: AVueFlow 
 Create base flow, same as `flow`.
 `A.f`
####   flow: AVueFlow 
 Create base flow same as `f`.
 `A.flow`
####   on: (parentFlowPath: string, actionPath: string) => AFlow<any> 
 When update parent flow node call action with parent flow data and set returned data from action as current flow.
 `A.on("user.id", "user.get-by-id")`
####   lazyOn: (parentFlowPath: string, actionPath: string) => AFlow<any> 
  Create edge if current flow used in vue templates. When update parent flow node call action with parent flow data and set returned data from action as current flow.
 `A.lazyOn("user.id", "user.get-by-id")`
####   get: (actionPath: string) => AFlow<any> 
 Create edge if current flow used in vue templates. Create flow from returned action data.
 `A.get('users.get-list`)`
####   lazyGet: (actionPath: string) => AFlow<any> 
 Create edge if current flow used in vue templates. Create flow from returned action data.
 `A.lazyGet('users.get-list`)`
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
 `$a.launch("user.get-by-id", 1)`
####   state: { [flowName: string]: any } 
 Global store for nodes with params `state` in flow graph schema
 reactive update in ui templates
 `$a.state.userId`
####   during: { [actionPath: string]: boolean } 
 Progress boolean state for any action by same path
 `$a.during['get-by-id]`
##  Vue Component Options

####     mapFlow?: { [propNameOrModuleName: string]: string[] | string } 
 map flow data to component state property
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
 ```
 onFlow:{
  "module1.username"(v){
     this.username = v.toUpperCase()
     // ... just do something with v flow data value
  }
 }
 ```
