# Meta API

API defining other APIs. This allows to abstractly describe the signature of the source code that can be written.
Using renderers, these MetaAPIs can be translated into API definitions (Blocky, TypeScript, etc).

The MetaAPI supports legacy Blockly modules definition. This type of definition is deprecated in favour of the MetaAPI. If writing a new set of blocks, please do it through the MetaAPI

## Properties

Each item of a MetaAPI can have:
 - `type`: Can be `module`, `variable`, `function`
 - `name`: name of the API module/property/method... (e.g. width, draw...)
 - `verbose`: Verbose version of the name. It is a short (few words) naming for the item
 - `returnType`: Defines the type of the variable, parameter or value returned by a function.

## Module

A module is a literal object that can contain a list of symbols.

## Variable

A literal object defining a variable with name, verbose and returnType.

## Function

A literal object defining a function with name, verbose, returnType and a list of optional parameters.

## Parameter

A literal object defining a paramneter with name, verbose, returnType.


