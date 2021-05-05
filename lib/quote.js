//Entry point
const quoteFilter = /(?:\s)?<\/cite>(?:\s)?/gm
const quoteFilter2 = /(?:\s)?<blockquote><cite>/gm
const quoteFilter25 = /(?:\s)?<\/blockquote>(?:\s)?/g
const quoteFilter3 = /<blockquote class="uncited">/gms
const quoteFilter4 = /```/g

const nestedQuoteStyle = content => {
    content = content.replace(quoteFilter3, 'Quote:')
    content = content.replace(quoteFilter, '\n')
    content = content.replace(quoteFilter2, '\n╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐\n') 
    content = content.replace(quoteFilter25,'\n╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘\n') 

    return content
}

const singleQuoteStyle = content => {
    content = content.replace(quoteFilter3, 'Quote:')
    content = content.replace(quoteFilter, '**\n```')
    content = content.replace(quoteFilter2, '\n**') 
    content = content.replace(quoteFilter25,'```') 

    return content
}

/*
Definition:
Linear blockquote
=> <blockquotes></blockquotes> ... <blockquotes></blockquotes>

Nested blockquote
=> <blockquotes>...<blockquotes></blockquotes>...</blockquotes>

Example string (Linear blockquotes, with the first linear blockquote being nested.)
=> <blockquotes>...<blockquotes></blockquotes>...</blockquotes> ... <blockquotes></blockquotes>

Purpose of function:
Given a string (containing a combination of linear AND nested blockquotes), split all linear blockquotes (even if nested) into individual
and store it in a list.

Another list will indicate if each blockquote is nested or not.

Algorithm explanation:
1. Loop through string and find '<'
2. Check if the next few letters after '<' character === '<blockquote>' (Reached first linear blockquote)
TRUE
3. Scan for the next '<'
4. Check if the next few letters after '<' is <blockquote> or </blockquote>. If it's not, continue scanning for the next '<'.
IF <blockquote>:
5. Found another blockquote, therefore the current blockquote we are in is nested. Set boolean isNested to true, and increment var nested.
IF </blockquote>:
5. Check if var nested === 0. If it is, the blockquote is a linear one. Store it in a var with isNested to false. 
If it is not, we are in a nested blockquote and decrement var nested by 1. Continue scanning from where we left off.
*/
const splitQuote = (message) => {
    let test = ''
    let test2 = ''
    let mainIndex = 0
    let nested = 0
    let list = []
    let listNested = []
    let isNested = false
    
    //This algorithm is not thought beforehand and therefore we have unnecessary step of having 2 for loops. 
    //I just don't really want to rewrite it with one for loop as I am afraid I may break something since this already works.
    for(let x = 0; x < message.length; x++){
        if(message[x] === '<')
        {
            test = message.slice(x,x+12)
            //console.log(test)
            if(test === '<blockquote>'){
                //Find if the next blockquote is <blockquote> or </blockquote>
                isNested = false
                for(let i = x+1; i < message.length; i++){
                    if(message[i] === '<'){
                        test2 = message.slice(i,i+13)
                        if(test2 === '</blockquote>'){
                            if(nested === 0){
                                list.push(message.slice(mainIndex, i+13))
                                listNested.push(isNested)
                                mainIndex = i+13
                                x = i
                                break
                            }
                            else{
                                nested -= 1
                            }
                        }
                        else if(test2.slice(0, test2.length-1) === '<blockquote>'){
                            nested++
                            isNested = true
                        }
                    }
                }
            }
        }
    }
    list.push(message.slice(mainIndex))
    
    obj = {
        contents: list,
        nested: listNested,
    }
    
    return obj
}

module.exports = {
    description: "Checks if a given String has nested quote.",
    styleQuote: (message) => {
        let list = []

        //Format empty quotes to blockquote with names.
        message = message.replace(quoteFilter3, '<blockquote><cite>Quote:</cite>')

        //Split string into a list of linear blockquotes.
        const obj = splitQuote(message)

        for(let i = 0; i < obj.nested.length; i++){
            //Blockquote is nested.
            if(obj.nested[i]){
                list.push(nestedQuoteStyle(obj.contents[i]))
            }
            //Blockquote is not nested.
            else{
                list.push(singleQuoteStyle(obj.contents[i]))
            }
        }

        list.push(obj.contents[obj.nested.length])

        let content = list.join('')

        if(content.length > 2048){
            content = content.slice(0, 2042)
            if(Array.from(content.matchAll(quoteFilter4)).length % 2 !== 0){
                content += '...```'
            }
            else{
                content += '...'
            }
        }

        return content
    }
}