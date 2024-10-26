$(document).ready(function() {
    console.log('3');
    // Load character limit from local storage or set default to 25
    let maxLength = localStorage.getItem('maxLength') ? parseInt(localStorage.getItem('maxLength')) : 25;
    $('#range').val(maxLength); // Set initial value of the range input

    // Function to remove text in square brackets
    const removeBrackets = (text) => {
        return text.replace(/\[[^\]]*\]/g, ''); // Remove [???] and its content
    };

    // Function to convert and copy the text
    const convertAndCopy = () => {
        const inputText = $('#input').val();
        const cleanedText = removeBrackets(inputText); // Remove brackets first
        // Split the cleaned text into lines and process each line
        const lines = cleanedText.split(/[\r\n]+/); // Split by line breaks
        const formattedLines = lines.map(line => addLineBreaks(line, maxLength)); // Adjust length as needed
        const formattedText = formattedLines.join('\n'); // Join lines back with line breaks
        $('#output').val(formattedText);

        // Copy the formatted text to clipboard
        navigator.clipboard.writeText(formattedText).then(function() {
            console.log('Converted text copied to clipboard successfully!');
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
        });
    };

    // Function to add line breaks for a single line, splitting close to middle
    const addLineBreaks = (text, maxLength) => {
        let result = '';
        while (text.length > maxLength) {
            let breakPoint = Math.floor(maxLength / 2);

            // Find a space or comma near the middle point to break the line
            while (breakPoint < text.length && text[breakPoint] !== ' ' && text[breakPoint] !== ',') {
                breakPoint++;
            }

            // If no space/comma found near the middle, go backward
            if (breakPoint >= text.length || breakPoint - maxLength / 2 > 10) {
                breakPoint = Math.floor(maxLength / 2);
                while (breakPoint > 0 && text[breakPoint] !== ' ' && text[breakPoint] !== ',') {
                    breakPoint--;
                }
            }

            // Ensure a suitable split even if no spaces or commas are found
            if (breakPoint === 0) breakPoint = maxLength;

            // Add the line to the result, checking for short tails
            let currentLine = text.slice(0, breakPoint).trim();
            text = text.slice(breakPoint).trim();

            // Adjust if last segment of the line is shorter than 10 characters
            if (text.length < 10) {
                currentLine += ' ' + text;
                text = '';
            }

            result += currentLine + '\n';
        }

        result += text.trim(); // Add any remaining text
        return result;
    };

    // On #range input change, update maxLength and save to local storage
    $('#range').on('input', function() {
        maxLength = parseInt($(this).val());
        localStorage.setItem('maxLength', maxLength); // Save to local storage
    });

    // On #input textarea change, convert and copy to clipboard
    $('#input').on('input', function() {
        convertAndCopy();
    });

    // On paste button click, paste text from clipboard into #input
    $('#paste').on('click', function() {
        navigator.clipboard.readText().then(function(text) {
            $('#input').val(text); // Paste text into #input
            convertAndCopy(); // Convert and copy after pasting
        }).catch(function(err) {
            console.error('Failed to read clipboard contents: ', err);
        });
    });
});
