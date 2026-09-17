const Test = require('../models/Test');
const User = require('../models/user');

const seedTests = async () => {
  try {
    const testCount = await Test.countDocuments();
    if (testCount >= 3) {
      console.log('Tests already seeded.');
      return;
    }

    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.findOne(); // fallback to first user
      if (!adminUser) {
        console.log('No user found to set as test creator.');
        return;
      }
    }
    const createdBy = adminUser._id;

    const tests = [
      {
        title: 'JavaScript Basics',
        description: 'Test your fundamental knowledge of JavaScript.',
        skill: 'JavaScript',
        difficulty: 'Beginner',
        duration: 15,
        coinReward: 30,
        passingScore: 60,
        createdBy,
        questions: [
          { question: 'What keyword declares a block-scoped variable?', options: ['var', 'let', 'const', 'function'], correctIndex: 1, explanation: 'let declares a block-scoped local variable.' },
          { question: 'Which method adds element to end of array?', options: ['push', 'pop', 'shift', 'unshift'], correctIndex: 0, explanation: 'push adds one or more elements to the end of an array.' },
          { question: 'What is the output of typeof null?', options: ['"null"', '"undefined"', '"object"', '"number"'], correctIndex: 2, explanation: 'In JS, typeof null is "object" due to a historical bug.' },
          { question: 'How do you write "Hello World" in an alert box?', options: ['msg("Hello World");', 'alert("Hello World");', 'msgBox("Hello World");', 'alertBox("Hello World");'], correctIndex: 1, explanation: 'alert() displays an alert box with a specified message.' },
          { question: 'Which operator is used to assign a value to a variable?', options: ['*', '-', '=', 'x'], correctIndex: 2, explanation: '= is the assignment operator.' },
          { question: 'Is JavaScript case-sensitive?', options: ['Yes', 'No', 'Only in strings', 'Only in variables'], correctIndex: 0, explanation: 'JavaScript is case-sensitive.' },
          { question: 'How do you create a function in JavaScript?', options: ['function = myFunction()', 'function myFunction()', 'function:myFunction()', 'create myFunction()'], correctIndex: 1, explanation: 'Functions are defined with the function keyword.' },
          { question: 'How does a FOR loop start?', options: ['for (i = 0; i <= 5)', 'for (i <= 5; i++)', 'for i = 1 to 5', 'for (i = 0; i <= 5; i++)'], correctIndex: 3, explanation: 'Initialization, condition, and increment.' },
          { question: 'What is the correct way to write a JavaScript array?', options: ['var colors = ["red", "green", "blue"]', 'var colors = "red", "green", "blue"', 'var colors = (1:"red", 2:"green", 3:"blue")', 'var colors = 1 = ("red"), 2 = ("green")'], correctIndex: 0, explanation: 'Arrays use square brackets.' },
          { question: 'Which event occurs when the user clicks on an HTML element?', options: ['onmouseclick', 'onchange', 'onclick', 'onmouseover'], correctIndex: 2, explanation: 'onclick event fires on mouse click.' },
          { question: 'How do you find the number with the highest value of x and y?', options: ['Math.max(x, y)', 'ceil(x, y)', 'Math.ceil(x, y)', 'top(x, y)'], correctIndex: 0, explanation: 'Math.max() returns the largest of the given numbers.' },
          { question: 'JavaScript is the same as Java.', options: ['True', 'False', 'Sometimes', 'Partially'], correctIndex: 1, explanation: 'They are completely different languages in both concept and design.' },
        ]
      },
      {
        title: 'React Fundamentals',
        description: 'Assess your knowledge of React core concepts.',
        skill: 'React.js',
        difficulty: 'Intermediate',
        duration: 15,
        coinReward: 40,
        passingScore: 60,
        createdBy,
        questions: [
          { question: 'Which hook is used for side effects?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correctIndex: 1, explanation: 'useEffect handles side effects in function components.' },
          { question: 'What does JSX stand for?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON X', 'JavaScript X'], correctIndex: 0, explanation: 'JSX is an XML/HTML-like syntax extension to JS.' },
          { question: 'How do you pass data to a child component?', options: ['State', 'Context', 'Props', 'Methods'], correctIndex: 2, explanation: 'Props (properties) are used to pass data.' },
          { question: 'What is used to pass data deeply without passing props down manually?', options: ['Redux', 'Context API', 'State', 'Hooks'], correctIndex: 1, explanation: 'Context provides a way to pass data through the component tree.' },
          { question: 'Which lifecycle method is invoked immediately after a component is mounted?', options: ['componentDidMount', 'componentWillMount', 'componentDidUpdate', 'componentWillUnmount'], correctIndex: 0, explanation: 'componentDidMount is called after the component is rendered.' },
          { question: 'In React, everything is a...', options: ['Module', 'Component', 'Package', 'Class'], correctIndex: 1, explanation: 'React applications are built from components.' },
          { question: 'How do you handle forms in React?', options: ['Controlled components', 'Uncontrolled components', 'Both', 'None of the above'], correctIndex: 2, explanation: 'React supports both controlled and uncontrolled components.' },
          { question: 'What is the default port for create-react-app?', options: ['3000', '8080', '5000', '4200'], correctIndex: 0, explanation: 'CRA uses port 3000 by default.' },
          { question: 'Which tool can you use to route in React?', options: ['React Router', 'Express', 'React Navigation', 'Both A and C'], correctIndex: 3, explanation: 'React Router for web, React Navigation for native.' },
          { question: 'What hook is used to access DOM elements?', options: ['useRef', 'useEffect', 'useState', 'useMemo'], correctIndex: 0, explanation: 'useRef returns a mutable ref object whose .current property is initialized to the passed argument.' },
          { question: 'React was originally created by...', options: ['Google', 'Facebook', 'Twitter', 'Microsoft'], correctIndex: 1, explanation: 'React was created by Jordan Walke, a software engineer at Facebook.' },
          { question: 'State in React is...', options: ['Immutable', 'Mutable directly', 'Read-only', 'Global by default'], correctIndex: 0, explanation: 'State should be treated as immutable and updated via setters.' },
        ]
      },
      {
        title: 'Node.js Mastery',
        description: 'Test your backend skills with Node.js.',
        skill: 'Node.js',
        difficulty: 'Advanced',
        duration: 20,
        coinReward: 50,
        passingScore: 70,
        createdBy,
        questions: [
          { question: 'Which core module is used to create an HTTP server?', options: ['fs', 'url', 'http', 'path'], correctIndex: 2, explanation: 'The http module allows creating a server.' },
          { question: 'What is the default package manager for Node.js?', options: ['yarn', 'npm', 'pnpm', 'bower'], correctIndex: 1, explanation: 'npm comes bundled with Node.js.' },
          { question: 'Node.js is completely synchronous.', options: ['True', 'False', 'Depends on OS', 'Only on Windows'], correctIndex: 1, explanation: 'Node.js is heavily asynchronous.' },
          { question: 'Which keyword is used to include a module in Node.js?', options: ['import', 'include', 'require', 'get'], correctIndex: 2, explanation: 'CommonJS uses require() to load modules.' },
          { question: 'What is Express.js?', options: ['Database', 'Frontend framework', 'Backend web framework', 'Testing tool'], correctIndex: 2, explanation: 'Express is a minimal backend framework for Node.' },
          { question: 'How do you read a file asynchronously in Node?', options: ['fs.read()', 'fs.readFileSync()', 'fs.readFile()', 'fs.getFile()'], correctIndex: 2, explanation: 'fs.readFile() is asynchronous.' },
          { question: 'Which variable holds the directory name of the current module?', options: ['__dirname', '__filename', 'process.cwd()', 'dir'], correctIndex: 0, explanation: '__dirname gives the directory of the current module.' },
          { question: 'Node.js runs on...', options: ['SpiderMonkey', 'V8 Engine', 'Chakra', 'JavaScriptCore'], correctIndex: 1, explanation: 'It uses Google Chrome\'s V8 JavaScript engine.' },
          { question: 'What does REPL stand for?', options: ['Read Eval Print Loop', 'Run Execute Print Loop', 'Read Express Print Loop', 'Run Eval Print Loop'], correctIndex: 0, explanation: 'It is a simple interactive programming environment.' },
          { question: 'Which command initializes a new Node project?', options: ['npm create', 'npm init', 'npm start', 'npm new'], correctIndex: 1, explanation: 'npm init creates a package.json file.' },
          { question: 'Event loop in Node.js handles...', options: ['Synchronous tasks', 'Asynchronous callbacks', 'Database connections only', 'Security'], correctIndex: 1, explanation: 'It allows Node.js to perform non-blocking I/O operations.' },
          { question: 'What is a Buffer in Node.js?', options: ['A caching mechanism', 'A temporary memory spot for data', 'A database', 'An error handler'], correctIndex: 1, explanation: 'Buffers handle binary data directly.' },
        ]
      },
      {
        title: 'Python Essentials',
        description: 'Check your Python programming basics.',
        skill: 'Python',
        difficulty: 'Beginner',
        duration: 15,
        coinReward: 30,
        passingScore: 60,
        createdBy,
        questions: [
          { question: 'How do you output "Hello" in Python?', options: ['echo "Hello"', 'print("Hello")', 'p("Hello")', 'console.log("Hello")'], correctIndex: 1, explanation: 'print() is used for output.' },
          { question: 'Which symbol is used for comments?', options: ['//', '/*', '#', '<!--'], correctIndex: 2, explanation: '# is used for single-line comments.' },
          { question: 'What is the correct extension for Python files?', options: ['.python', '.pt', '.pyt', '.py'], correctIndex: 3, explanation: '.py is standard.' },
          { question: 'How do you create a variable with the numeric value 5?', options: ['x = 5', 'int x = 5', 'num x = 5', 'val x = 5'], correctIndex: 0, explanation: 'Python has no command for declaring a variable; just assign.' },
          { question: 'What is the correct way to create a function in Python?', options: ['function my_function():', 'def my_function():', 'create my_function():', 'def function():'], correctIndex: 1, explanation: 'def keyword is used to define functions.' },
          { question: 'Which collection is ordered, changeable, and allows duplicates?', options: ['Set', 'Dictionary', 'Tuple', 'List'], correctIndex: 3, explanation: 'Lists have these properties.' },
          { question: 'How do you start a while loop in Python?', options: ['while x > y {', 'while x > y:', 'while (x > y)', 'while x > y'], correctIndex: 1, explanation: 'Colon is required after the condition.' },
          { question: 'What is a correct syntax to output the type of a variable?', options: ['print(type(x))', 'print(typeof(x))', 'print(typeof x)', 'print(typeOf(x))'], correctIndex: 0, explanation: 'type() returns the type.' },
          { question: 'Which method can be used to return a string in upper case letters?', options: ['upperCase()', 'upper()', 'toUpperCase()', 'uppercase()'], correctIndex: 1, explanation: 'upper() converts string to uppercase.' },
          { question: 'Which operator is used to multiply numbers?', options: ['*', 'x', '%', '#'], correctIndex: 0, explanation: '* is multiplication.' },
          { question: 'What is the output of 2 ** 3?', options: ['6', '8', '9', 'Error'], correctIndex: 1, explanation: '** is the exponentiation operator.' },
          { question: 'Python is a compiled language.', options: ['True', 'False', 'Both', 'None'], correctIndex: 1, explanation: 'It is generally interpreted.' },
        ]
      },
      {
        title: 'MongoDB Querying',
        description: 'Test your NoSQL database knowledge.',
        skill: 'MongoDB',
        difficulty: 'Intermediate',
        duration: 12,
        coinReward: 35,
        passingScore: 60,
        createdBy,
        questions: [
          { question: 'What type of database is MongoDB?', options: ['Relational', 'Document-oriented', 'Key-Value', 'Graph'], correctIndex: 1, explanation: 'MongoDB stores data in JSON-like documents.' },
          { question: 'Which command inserts a document into a collection?', options: ['db.collection.add()', 'db.collection.insert()', 'db.collection.create()', 'db.collection.push()'], correctIndex: 1, explanation: 'insert() or insertOne()/insertMany().' },
          { question: 'What is the default primary key field in MongoDB?', options: ['id', 'key', '_id', 'uuid'], correctIndex: 2, explanation: '_id is automatically generated.' },
          { question: 'How do you find all documents in a collection?', options: ['db.collection.get()', 'db.collection.findAll()', 'db.collection.find()', 'db.collection.search()'], correctIndex: 2, explanation: 'find() with no arguments returns all docs.' },
          { question: 'Which operator is used for "greater than"?', options: ['$gt', '$greater', '>', '$ge'], correctIndex: 0, explanation: '$gt stands for greater than.' },
          { question: 'How do you update a document?', options: ['db.collection.modify()', 'db.collection.update()', 'db.collection.set()', 'db.collection.change()'], correctIndex: 1, explanation: 'update(), updateOne(), updateMany().' },
          { question: 'Which keyword is used in Node.js to connect to MongoDB easily?', options: ['Sequelize', 'Mongoose', 'TypeORM', 'Prisma'], correctIndex: 1, explanation: 'Mongoose is a popular ODM for MongoDB.' },
          { question: 'What does the $set operator do?', options: ['Deletes a field', 'Updates the value of a field', 'Creates a collection', 'Sets permissions'], correctIndex: 1, explanation: '$set replaces the value of a field.' },
          { question: 'How can you limit the number of documents returned?', options: ['db.collection.find().limit(5)', 'db.collection.find(5)', 'db.collection.find().max(5)', 'db.collection.find().top(5)'], correctIndex: 0, explanation: 'limit() specifies the max number.' },
          { question: 'MongoDB uses tables and rows.', options: ['True', 'False', 'Only in strict mode', 'Yes but called differently'], correctIndex: 1, explanation: 'It uses collections and documents.' },
        ]
      },
      {
        title: 'UI/UX Design Basics',
        description: 'Check your design thinking and principles.',
        skill: 'UI/UX Design',
        difficulty: 'Beginner',
        duration: 10,
        coinReward: 25,
        passingScore: 60,
        createdBy,
        questions: [
          { question: 'What does UX stand for?', options: ['User Experience', 'User Execution', 'Universal Experience', 'User Extension'], correctIndex: 0, explanation: 'User Experience' },
          { question: 'What does UI stand for?', options: ['User Internet', 'Universal Interface', 'User Interface', 'User Integration'], correctIndex: 2, explanation: 'User Interface' },
          { question: 'Which tool is widely used for UI/UX design?', options: ['Figma', 'Photoshop', 'Notepad++', 'Excel'], correctIndex: 0, explanation: 'Figma is a collaborative interface design tool.' },
          { question: 'What is a wireframe?', options: ['A final design', 'A low-fidelity visual representation of a layout', 'A piece of code', 'A database schema'], correctIndex: 1, explanation: 'Wireframes are basic blueprints.' },
          { question: 'What is whitespace in design?', options: ['The color white', 'Empty space between elements', 'A type of font', 'A mistake'], correctIndex: 1, explanation: 'It helps structure content and improve readability.' },
          { question: 'A/B testing involves...', options: ['Testing 2 versions of a design to see which performs better', 'Testing alphabets', 'Testing on 2 devices', 'Testing colors only'], correctIndex: 0, explanation: 'It compares variants to determine effectiveness.' },
          { question: 'Which principle ensures elements are arranged by importance?', options: ['Contrast', 'Alignment', 'Visual Hierarchy', 'Repetition'], correctIndex: 2, explanation: 'Visual hierarchy guides the user\'s eye.' },
          { question: 'What is a prototype?', options: ['A final product', 'An interactive mockup of a design', 'A text document', 'A wireframe'], correctIndex: 1, explanation: 'Prototypes simulate the final interaction.' },
          { question: 'Typography refers to...', options: ['The style and appearance of printed matter/text', 'Images', 'Colors', 'Layout'], correctIndex: 0, explanation: 'It is the art of arranging type.' },
          { question: 'What is the main goal of good UX?', options: ['Make it look pretty', 'Make it complicated', 'Ensure a smooth and satisfying user journey', 'Use many colors'], correctIndex: 2, explanation: 'Good UX fulfills the user\'s needs effortlessly.' },
        ]
      }
    ];

    await Test.insertMany(tests);
    console.log('Successfully seeded tests!');
  } catch (error) {
    console.error('Error seeding tests:', error);
  }
};

module.exports = seedTests;
