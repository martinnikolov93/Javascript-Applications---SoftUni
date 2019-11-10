function solve() {
    class Post {
        constructor(title, content) {
            this.title = title;
            this.content = content;
        }

        toString() {
            return `Post: ${this.title}\nContent: ${this.content}`
        }
    }

    class SocialMediaPost extends Post {
        constructor(title, content, likes, dislikes) {
            super(title, content);
            this.likes = Number(likes);
            this.dislikes = Number(dislikes);
            this.comments = [];
        }

        addComment(comment){
            this.comments.push(comment);
        }

        toString() {
            let string = `Post: ${this.title}\nContent: ${this.content}\nRating: ${this.likes - this.dislikes}`;

            if (this.comments.length !== 0){
                string += `\nComments:\n`;
                for (let i = 0; i < this.comments.length; i++) {
                    string += ` * ${this.comments[i]}`;
                    if (i !== this.comments.length - 1){
                        string += '\n';
                    }
                }
            }

            return string;
        }

    }

    class BlogPost extends Post{
        constructor(title, content, views) {
            super(title, content);
            this.views = Number(views);
        }

        view(){
            this.views++;
            return this;
        }

        toString() {
            return `Post: ${this.title}\nContent: ${this.content}\nViews: ${this.views}`;
        }
    }

    return {Post, SocialMediaPost, BlogPost}
}
