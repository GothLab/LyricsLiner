$(document).ready(function() {
    // Load character limit from local storage or set default to 25
    let maxLength = localStorage.getItem('maxLength') ? parseInt(localStorage.getItem('maxLength')) : 25;
    $('#range').val(maxLength); // Set initial value of the range input

    // Function to remove text in square brackets
    const removeBrackets = (text) => {
        return text.replace(/\[[^\]]*\]/g, ''); // Remove [???] and its content
    };

    // On convert button click, copy text from #input to #output
    $('#convert').on('click', function() {
        const inputText = $('#input').val();
        const cleanedText = removeBrackets(inputText); // Remove brackets first
        // Split the cleaned text into lines and process each line
        const lines = cleanedText.split(/[\r\n]+/); // Split by line breaks
        const formattedLines = lines.map(line => addLineBreaks(line, maxLength)); // Adjust length as needed
        const formattedText = formattedLines.join('\n'); // Join lines back with line breaks
        $('#output').val(formattedText);
    });

    // Function to add line breaks for a single line
    const addLineBreaks = (text, maxLength) => {
        const words = text.split(' '); // Split text into words
        let currentLine = '';
        let result = '';

        words.forEach((word) => {
            if ((currentLine + word).length > maxLength) {
                // If adding the next word exceeds maxLength, add currentLine to result and start a new line
                result += currentLine.trim() + '\n'; // Trim to avoid extra space
                currentLine = word + ' '; // Start new line with the current word
            } else {
                currentLine += word + ' '; // Add the word to the current line
            }
        });

        result += currentLine.trim(); // Add any remaining text to result
        return result;
    };

    // On #range input change, update maxLength and save to local storage
    $('#range').on('input', function() {
        maxLength = parseInt($(this).val());
        localStorage.setItem('maxLength', maxLength); // Save to local storage
    });

    // On copy button click, copy #output textarea into clipboard
    $('#copy').on('click', function() {
        const outputText = $('#output').val();
        navigator.clipboard.writeText(outputText).then(function() {
            console.log('Copied to clipboard successfully!');
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
        });
    });

    // On paste button click, paste text from clipboard into #input
    $('#paste').on('click', function() {
        navigator.clipboard.readText().then(function(text) {
            $('#input').val(text); // Paste text into #input
        }).catch(function(err) {
            console.error('Failed to read clipboard contents: ', err);
        });
    });
});
