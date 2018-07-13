# [DRAFT] Creation API

Provides a sharing flow for creations. Prompts the user to input a title and description for their creation while displaying a preview.

Early draft psuedo-code:

```js
onShare(context) {
    const { data } = context;
    context.setUploading(true);
    // data will contain title, description, preview and attachment
    return fetch('my.backend.com', {
        method: 'POST',
        body: JSON.stringify(data)
    }).then((res) => {
        if (res.statusCode !== 200) {
            context.setFailure(true);
            context.setFailureReason('Could not contact the API');
            return;
        }
        return res.json();
    }).then((res) => {
        context.setSuccess(true);
        context.setSuccessMessage('We saved your creation!');
    });
}

```