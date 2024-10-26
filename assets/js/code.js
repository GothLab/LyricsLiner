$(document).ready(function() {
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

    // Enhanced function to add line breaks for a single line with additional conditions
    const addLineBreaks = (text, maxLength) => {
        // If text is shorter than maxLength or is a single word, return it as is
        if (text.length <= maxLength || text.split(' ').length === 1) return text;

        // Check for commas and split based on them if possible
        if (text.includes(',')) {
            let result = '';
            const segments = text.split(',');
            segments.forEach((segment, index) => {
                // Only add line breaks if segment length exceeds maxLength
                if (segment.trim().length > maxLength) {
                    result += splitAtWord(segment.trim(), maxLength);
                } else {
                    result += segment.trim();
                }
                if (index < segments.length - 1) result += ',\n'; // Add comma and newline
            });
            return result;
        }

        // If no comma, try splitting near the middle while avoiding word splits
        return splitAtWord(text, maxLength);
    };

    // Helper function to split a line near maxLength while avoiding word splits
    const splitAtWord = (text, maxLength) => {
        let words = text.split(' ');
        let currentLine = '';
        let result = '';

        words.forEach((word) => {
            if ((currentLine + word).length > maxLength) {
                result += currentLine.trim() + '\n'; // Start a new line
                currentLine = word + ' '; // Start new line with the current word
            } else {
                currentLine += word + ' ';
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
