const parser = require('node-html-parser')

class HtmlParser {

  static parseCommentData(data) {
    const comments = []

    data.forEach((node) => {
      const comment = node.commentThreadRenderer ? node.commentThreadRenderer.comment.commentRenderer : node.commentRenderer
      let replies = null
      let text = ''
      let isHearted = false

      const commentId = comment.commentId
      const authorId = comment.authorEndpoint.browseEndpoint.browseId
      const authorName = comment.authorText.simpleText
      const authorThumbnails = comment.authorThumbnail.thumbnails
      const likes = comment.likeCount
      const numReplies = comment.replyCount ? comment.replyCount : 0
      const publishedTimeText = comment.publishedTimeText.runs[0].text
      const publishedText = publishedTimeText.replace('(edited)', '').trim()
      const isEdited = publishedTimeText.includes('edited')

      const heartBadge = comment.actionButtons.commentActionButtonsRenderer.creatorHeart

      if (typeof heartBadge !== 'undefined') {
        isHearted = heartBadge.creatorHeartRenderer.isHearted
      }

      const contentText = comment.contentText.runs

      contentText.forEach((content) => {
        if (content.text.trim() === '') {
          text = text + '<br>'
        } else {
          text = text + content.text
        }
      })

      const object = {
        authorThumb: authorThumbnails,
        author: authorName,
        authorId: authorId,
        commentId: commentId,
        text: text,
        likes: likes,
        numReplies: numReplies,
        isHearted: isHearted,
        time: publishedText,
        edited: isEdited,
        replyToken: null
      }

      if (comment.replyCount > 0) {
        const replyNode = node.commentThreadRenderer.replies.commentRepliesRenderer
        const continuation = replyNode.continuations[0].nextContinuationData.continuation
        object.replyToken = continuation
      }

      comments.push(object)
    })

    return comments
  }
}

module.exports = HtmlParser
