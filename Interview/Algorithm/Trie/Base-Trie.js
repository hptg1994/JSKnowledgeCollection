class TrieNode {
    constructor(char) {
        // 这个char下面的children
        this.children = [];
        for (var i = 0; i < 26; i++) { //Total # of English Alphabets
            this.children[i] = null;
        }
        this.isEndWord = false; //will be true if the node represents the end of word
        this.char = char; //To store the value of a particular key
    }
    //Function to mark the currentNode as Leaf
    markAsLeaf() {
        this.isEndWord = true;
    }

    //Function to unMark the currentNode as Leaf  
    unMarkAsLeaf() {
        this.isEndWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode(''); //Root node
    }
    //Function to get the index of character 't'
    getIndex(t) {
        return t.charCodeAt(0) - "a".charCodeAt(0);
    }

    //Function to insert a key,value pair in the Trie, key is the whole word
    insert(key, value) {
        //None keys are not allowed
        if (key == null) {
            return;
        }

        key = key.toLowerCase();  //Keys are stored in lowercase
        let currentNode = this.root;
        let index = 0;          //To store the character index

        //Iterate the trie with the given character index,
        //If the index points to null
        //simply create a TrieNode and go down a level, loop each of the char in the word
        for (var level = 0; level < key.length; level++) {
            let index = this.getIndex(key[level]);
            if (currentNode.children[index] == null) {
                currentNode.children[index] = new TrieNode(key[level]);
                // console.log(String(key[level]) + " inserted");
            }
            // currentNode 向下传了一个
            currentNode = currentNode.children[index];
        }

        //Mark the end character as leaf node
        currentNode.markAsLeaf();
        // console.log("'" + key + "' inserted");
    }


    //Function to search a given key in Trie
    search(key) {
        if (key == null) {
            return false; //null key
        }

        key = key.toLowerCase();
        let currentNode = this.root;
        let index = 0;

        //Iterate the Trie with given character index,
        //If it is null at any point then we stop and return false
        //We will return true only if we reach leafNode and have traversed the
        //Trie based on the length of the key

        for (var level = 0; level < key.length; level++) {
            index = this.getIndex(key[level]);
            if (currentNode.children[index] == null) {
                return false;
            }
            currentNode = currentNode.children[index];
        }
        if (currentNode != null && currentNode.isEndWord) {
            return true;
        }
        return false;
    }
    hasNoChildren(currentNode) {
        for (var i = 0; i < currentNode.children.length; i++) {
            if (currentNode.children[i] != null)
                return false;
        }
        return true;
    }

    //Recursive function to delete given key
    deleteHelper(key, currentNode, length, level) {
        let deletedSelf = false;

        if (currentNode == null) {
            console.log("Key does not exist");
            return deletedSelf;
        }

        //Base Case: If we have reached at the node which points to the alphabet at the end of the key.
        if (level == length) {
            //If there are no nodes ahead of this node in this path
            //Then we can delete this node
            if (this.hasNoChildren(currentNode)) {
                currentNode = null;
                deletedSelf = true;
            }

            //If there are nodes ahead of currentNode in this path 
            //Then we cannot delete currentNode. We simply unmark this as leaf
            else {
                currentNode.unMarkAsLeaf();
                deletedSelf = false;
            }
        }
        else {
            let childNode = currentNode.children[this.getIndex(key[level])];
            let childDeleted = this.deleteHelper(key, childNode, length, level + 1);
            if (childDeleted) {
                //Making children pointer also None: since child is deleted
                currentNode.children[this.getIndex(key[level])] = null;
                //If currentNode is leaf node that means currentNode is part of another key
                //and hence we can not delete this node and it's parent path nodes
                if (currentNode.isEndWord)
                    deletedSelf = false;

                //If childNode is deleted but if currentNode has more children then currentNode must be part of another key
                //So, we cannot delete currenNode
                else if (this.hasNoChildren(currentNode) == false)
                    deletedSelf = false;

                //Else we can delete currentNode
                else {
                    currentNode = null;
                    deletedSelf = true;
                }
            }
            else
                deletedSelf = false;
        }
        return deletedSelf
    }

    //Function to delete given key from Trie
    delete(key) {
        if (this.root == null || key == null) {
            console.log("None key or empty trie error");
            return;
        }

        this.deleteHelper(key, this.root, key.length, 0);
    }
}

// Input keys (use only 'a' through 'z' and lower case)
let keys = ["the", "a", "there", "answer", "any", "by", "bye", "their", "abc"];
let output = ["Not present in trie", "Present in trie"];

let t = new Trie();
// console.log("Keys to insert: ");
// console.log(keys);


//Construct Trie
for (var i = 0; i < keys.length; i++) {
    t.insert(keys[i], i);
}

//Search for different keys
if (t.search("the") == true)
    console.log("the --- " + output[1]);
else
    console.log("the --- " + output[0]);

if (t.search("these") == true)
    console.log("these --- " + output[1]);
else
    console.log("these --- " + output[0]);

if (t.search("abc") == true)
    console.log("abc --- " + output[1]);
else
    console.log("abc --- " + output[0]);

if (t.search("th") == true)
    console.log("th --- " + output[1]);
else
    console.log("th --- " + output[0]);