import os
import json
import re
from marshmallow import Schema, fields, validate
from marshmallow import Schema, fields, INCLUDE
from marshmallow.validate import Length

#  Load feature list 
BASE_DIR      = os.path.dirname(__file__)
features_path = os.path.join(BASE_DIR, "features.json")
with open(features_path, "r") as f:
    feature_order = json.load(f)["features"]  # must be a list of strings

#  Payload Schemas 
class RegisterSchema(Schema):
    first_name = fields.Str(
        required=True,
        validate=validate.Length(min=1),
    )
    surname = fields.Str(
        required=True,
        validate=validate.Length(min=1),
    )
    username = fields.Str(
        required=True,
        validate=validate.Length(min=3),
    )
    email = fields.Email(
        required=True,
    )
    password = fields.Str(
        required=True,
        validate=validate.Length(min=6),
    )
class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)

class SurveySchema(Schema):
    responses = fields.Dict(
        keys=fields.Str(),
        values=fields.Raw(),
        required=True
    )

#  Prediction Schema 
class PredictSchema(Schema):
    """
    One Float field per feature, defaulting to 0.0.
    We sanitize each feature into a valid Python attr name,
    and use data_key to map it back to the original JSON field.
    """
    class Meta:
        # if the JSON contains extra fields, include them (or use EXCLUDE to throw errors)
        unknown = INCLUDE

# Dynamically attach sanitized fields:
for feat in feature_order:
    # make a valid Python identifier: replace non-alphanum with underscores; prefix leading digits
    attr_name = re.sub(r'\W+', '_', feat)
    if re.match(r'^\d', attr_name):
        attr_name = f'f_{attr_name}'
    # attach a Float field that looks at JSON key == feat
    setattr(
        PredictSchema,
        attr_name,
        fields.Float(
            required=False,
            load_default=0.0,
            data_key=feat  # map JSON "2024 Electorate" → this field
        )
    )
