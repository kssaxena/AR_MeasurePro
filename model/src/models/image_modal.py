import os
import datetime
import mongoengine as me
# import jwt

# Connect to MongoDB
me.connect('DB_NAME')

class Image(me.EmbeddedDocument):
    processed = me.EmbeddedDocumentField(
        document_type=type(
            'ProcessedImage', (me.EmbeddedDocument,), {
                'url': me.StringField(),
                'fileId': me.StringField()
            }
        )
    )

class User(me.Document):
    name = me.StringField(required=True)
    number = me.StringField(required=True, unique=True)
    images = me.EmbeddedDocumentListField(Image)
    created_at = me.DateTimeField(default=datetime.datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.datetime.utcnow)

    meta = {
        'collection': 'users',
        'indexes': ['number'],
        'ordering': ['-created_at'],
        'auto_create_index': True
    }