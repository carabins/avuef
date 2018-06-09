# Avue - Finte State Mashine 
## plugin for vue and nuxt
[![npm version](https://badge.fury.io/js/avuef.svg)](https://badge.fury.io/js/avuef)
[![Build Status](https://travis-ci.org/carabins/avuef.svg?branch=master)](https://travis-ci.org/carabins/avuef)
[![dependencies](https://david-dm.org/gleba/avuef.svg)](https://david-dm.org/avuef/alak)
[![Downloads](https://img.shields.io/npm/dt/avuef.svg)](https://www.npmjs.com/package/avuef)

### Documentation DRAFT

TODO перосмыслить, отформатироваь -> перевести

Avue - гибкий инстурмент управления состояением приложения ориентированный на экспертов имеющих опыт постороения flux или mvc архитектур. 

#### A & F

Два базовых понятия небоходимые для построения схемы это потоки - [F]low и действия [A]ctions.

##### Flow
Класс описания схемы, стейта и связей между узлами. 
Все параметры класcа являются либо объектами содержашими узлы либо узлами.
Узлы являются контейнарми состояний, содержат данные и имеют тип AFlow https://github.com/gleba/alak/tree/master/docs
Узел создаётся статичным либо как производная - дочерний узел в потоке данных.  
Доступные параметры узлов:

#### `A.flow` & `A.f`
Базовый узел AFlow, может быть дополнен свойствами :  
##### `state`
Данные узла становятся реактивно доступны из шаблонов компонентов в глобальном стейте vue `$a.state.[nodeName]` по имени ноды игнорируя родительский путь.
##### `stored`
Сохранение и восстановления данных узла с помошью LocalStorage
##### `immutable`
Узел будет всегда отдавать копию данных.
#### `A.f.stateless()`
Узел не будет хранить состояния анологично шине собыйтй.

Сохранение и восстановления данных узла с помошью LocalStorage


```
import {A} from "avuef";
export default class FlowGraph {  
  nodeA = A.f.store
  module = {
    
  }
``
import {A} from "avuef";
export default class FlowGraph {
  nodeRoot = A.f
