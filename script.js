// Simulated async functions to fetch user, posts, and comments

function fetchUserProfile() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Math.random() < 0.9 ? resolve({ id: 1, name: 'Joshua Salazar' }) : reject('Failed to fetch user profile.');
        }, 1000);
    });
}

function fetchPosts(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Math.random() < 0.9 ? resolve([
                { id: 101, title: 'First Post', userId },
                { id: 102, title: 'Second Post', userId }
            ]) : reject('Failed to fetch posts.');
        }, 1500);
    });
}

function fetchComments(postId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Math.random() < 0.7 ? resolve([
                { id: 1001, comment: 'Great post!', postId },
                { id: 1002, comment: 'Thanks for sharing.', postId }
            ]) : reject('Failed to fetch comments.');
        }, 2000);
    });
}

// Sequential fetch with async/await
async function getUserContentSequential() {
    try {
        const user = await fetchUserProfile();
        console.log('User profile retrieved:', user);

        const posts = await fetchPosts(user.id);
        console.log('Posts retrieved:', posts);

        for (const post of posts) {
            try {
                const comments = await fetchComments(post.id);
                console.log(`Comments for Post ${post.id} retrieved:`, comments);
            } catch (error) {
                console.error(`Error retrieving comments for Post ${post.id}:`, error);
            }
        }

    } catch (error) {
        console.error('Sequential fetch failed:', error);
    }
}

// Parallel fetch with async/await
async function getUserContentParallel() {
    try {
        const [user, posts] = await Promise.all([
            fetchUserProfile(),
            fetchPosts(1) // assuming default userId = 1
        ]);

        console.log('User profile and posts retrieved in parallel:', user, posts);

        const commentsPromises = posts.map(post => 
            fetchComments(post.id).catch(error => ({ error, postId: post.id }))
        );
        const comments = await Promise.all(commentsPromises);

        comments.forEach(c => {
            if (c.error) {
                console.error(`Error retrieving comments for Post ${c.postId}:`, c.error);
            } else {
                console.log(`Comments for Post ${c[0]?.postId} retrieved:`, c);
            }
        });

    } catch (error) {
        console.error('Parallel fetch failed:', error);
    }
}

// Call the primary function
getUserContentSequential().then(() => {
    console.log('\n--- Now fetching in parallel ---\n');
    return getUserContentParallel();
});
