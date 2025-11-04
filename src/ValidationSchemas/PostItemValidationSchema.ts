let PostItemValidationSchema = {
    schema: {
        body: {
            type: 'object',
            required: ["name", "quantity"],
            properties: {
                name: {type: 'string'},
                quantity: {type: 'number'}
            }
        }
    }
}

export default PostItemValidationSchema;