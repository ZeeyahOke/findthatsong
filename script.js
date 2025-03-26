document.addEventListener('DOMContentLoaded', () => {
    const lyricInput = document.getElementById('lyric-input');
    const searchButton = document.getElementById('search-button');
    const resultsSection = document.getElementById('results');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');
    const genre = document.getElementById('genre');
    const additionalInfo = document.getElementById('additional-info');
    const errorMessage = document.getElementById('error-message');
    const loader = document.querySelector('.loader');


    const apiKey = '1d95e7505a701f4575da99b0195c25c3';
    const baseUrl = 'https://api.musixmatch.com/ws/1.1/';
    
    // Track analytics for deployed site
    function logAnalytics(action, details = {}) {
        if (window.location.hostname.includes('zeeyahoke.tech')) {
            console.log(`Analytics: ${action}`, details);

        }
    }

    searchButton.addEventListener('click', searchLyrics);
    lyricInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchLyrics();
        }
    });

    async function searchLyrics() {
        const lyrics = lyricInput.value.trim();
        
        if (!lyrics) {
            showError('Please enter some lyrics to search');
            return;
        }

        showLoader();
        clearResults();
        resultsSection.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        
        logAnalytics('search_attempt', { query_length: lyrics.length });

        try {
            // Search for track based on lyrics
            const searchResponse = await fetch(`${baseUrl}track.search?q_lyrics=${encodeURIComponent(lyrics)}&page_size=1&page=1&s_track_rating=desc&apikey=${apiKey}`);
            const searchData = await searchResponse.json();

            if (searchData.message.header.status_code !== 200 || !searchData.message.body.track_list.length) {
                showError('No songs found with those lyrics. Try a different lyric snippet.');
                logAnalytics('search_no_results', { query: lyrics });
                return;
            }

            const track = searchData.message.body.track_list[0].track;
            
            // Get more track details
            const trackDetailsResponse = await fetch(`${baseUrl}track.get?track_id=${track.track_id}&apikey=${apiKey}`);
            const trackDetailsData = await trackDetailsResponse.json();
            
            if (trackDetailsData.message.header.status_code !== 200) {
                showError('Error fetching song details');
                logAnalytics('details_error', { track_id: track.track_id });
                return;
            }
            
            const trackDetails = trackDetailsData.message.body.track;
            
            // Display results
            displayResults(trackDetails);
            logAnalytics('search_success', { 
                track_name: trackDetails.track_name,
                artist_name: trackDetails.artist_name
            });
        } catch (error) {
            console.error('Error:', error);
            showError('An error occurred while searching. Please try again later.');
            logAnalytics('search_error', { error_message: error.message });
        } finally {
            hideLoader();
        }
    }

    function displayResults(track) {
        songTitle.textContent = track.track_name;
        artistName.textContent = `Artist: ${track.artist_name}`;
        genre.textContent = `Genre: ${track.primary_genres.music_genre_list.length > 0 ? 
            track.primary_genres.music_genre_list[0].music_genre.music_genre_name : 'Unknown'}`;
        
        // Additional information
        additionalInfo.innerHTML = `
            <p><strong>Album:</strong> ${track.album_name}</p>
            <p><strong>Explicit:</strong> ${track.explicit === 1 ? 'Yes' : 'No'}</p>
            <p><strong>Rating:</strong> ${track.track_rating}/100</p>
        `;
        
        if (track.has_lyrics === 1) {
            const lyricsLink = document.createElement('a');
            lyricsLink.href = track.track_share_url;
            lyricsLink.target = '_blank';
            lyricsLink.textContent = 'View Full Lyrics';
            lyricsLink.addEventListener('click', () => {
                logAnalytics('lyrics_link_click', { track_name: track.track_name });
            });
            additionalInfo.appendChild(lyricsLink);
        }
    }

    function clearResults() {
        songTitle.textContent = '';
        artistName.textContent = '';
        genre.textContent = '';
        additionalInfo.innerHTML = '';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        hideLoader();
    }

    function showLoader() {
        loader.classList.remove('hidden');
    }

    function hideLoader() {
        loader.classList.add('hidden');
    }
    
    // Log page load for analytics
    logAnalytics('page_view');
});