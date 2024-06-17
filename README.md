## Overview:

This Node.js server is designed to integrate with the OpenAI API for generating and describing images, managing asynchronous threads, and handling dynamic requests. It utilizes Express for routing, supports environmental configuration, and employs robust error handling and logging.

## Server Initialization:

- The server listens on a configurable port and uses environmental variables for settings like API keys.

```
OPENAI_API_KEY=sk-proj-<project-key>
POSTS_ASSISTANT=asst_gN17ebClyJwaXaD7WI6YvTnt
ROLES_ASSISTANT=asst_KbMKmuz8N5nijYH8ucI0wEYV
```

## Endpoints

### Testing

Created a shared Postman to make it easier to use pm global variables to carry over image description thread and run id etc between role and posts requests. also check out the visualized tab to see the images after request completes

https://lunar-flare-318307.postman.co/workspace/New-Team-Workspace~f485e9c5-cd10-4103-9d52-dd19dddf2810/collection/34897079-e3fca786-4916-40ff-80f8-8b709022f18f?action=share&creator=34897079#### Roles

```
 curl -X POST http://localhost:3000/api/assist -H "Content-Type: application/json" -d '{"message": "Club Name: Vampires of Brooklyn Interests: ASMR, Blockchain, Cottage Core", "assistant": "roles"}'
```

#### Posts

```
curl -X POST http://localhost:3000/api/assist \
-H "Content-Type: application/json" \
-d "{ \
  \"message\": \"'Time hook: Crying, Place: Empire State Building'\", \
  \"assistant\": \"posts\", \
  \"imageDescription\": \"<role-image-descripion-from-roles-response>\" \
}"
```

#### Prompts

```
Create a detailed character for a role-playing game, including their background, profession, skills, and a unique personal quirk. Provide a brief storyline or scenario where this character's abilities and traits would play a crucial role, emphasizing their integration into the game's world, icluding backstory that aligns with the game's setting and theme.
This character should have a diverse first name and last name inspired by various cultures and mythologies, and a description of 100 words. Describe an image in 80 words of this role in a paragraph, don't use any special character, well detailed character(human/non-human, gender, age) , scenario(theme, background), style(Real-Time, Realistic, Cartoon, Anime, Manga, Surreal).
Provide the output in JSON structure like this {"op1": "<role name>", "op2": "<role description>",  "op0" : "<the image>"}.
When creating an image, use the provided generate_image function to return the image, using the op0 value from the output JSON as the required prompt parameter to the provided generate_image function. After you have all the required data, make an explicit call to the generate_image always, do not memorize previous calls. For run one and only one generate_image function must be called. For example given input 'Club Name: Chips in a Pickle, User Interests : pickles, dill, spice, chips, crunchy, aftertaste, snacks, munching' and an `op0` of 'Imagine a lively, animated scene. Piper Salter, a sprightly young woman with a flair for eccentric fashion sporting an apron splattered with dill and spices. Her hair, tied up in a playful knot, bounces as she stirs a giant shimmering steel vat full of bubbling pickles. Her eyes, lit with a mischievous spark, scan over her colorful shop adorned with jars of crunchy, spicy pickles and stacks of freshly made chips. The setting is vibrant and the style distinctly anime, capturing her dynamic energy and the textured detail of the condiments.' call function generate_image('Imagine a lively, animated scene. Piper Salter, a sprightly young woman with a flair for eccentric fashion sporting an apron splattered with dill and spices. Her hair, tied up in a playful knot, bounces as she stirs a giant shimmering steel vat full of bubbling pickles. Her eyes, lit with a mischievous spark, scan over her colorful shop adorned with jars of crunchy, spicy pickles and stacks of freshly made chips. The setting is vibrant and the style distinctly anime, capturing her dynamic energy and the textured detail of the condiments.')
```

```
You are a narrative designer who designs post and a fortune cookie message using user input\
Make sure the caption is short, tweet-sized one-sentence plot points to flesh out an existing storyline and incorporates historical or cultural context based on the location\
Make sure that fortune cookie message in the format of social post like instagram with a limit of 60 words\
Assign a catchy name to this post and use a few emojis in post\
Describe an image in 80 words of this post in a paragraph, it must describe the same character(human/non-human ) as the role which is at the start of this thread with this post's scenario(theme, background), style(Real-Time, Realistic, Cartoon, Anime, Manga, Surreal)\
Provide the output in JSON structure like this {"op1": "<name>", "op2": "<caption>", "op3": "<fortune-cookie>",  "op0" : "<the image>"}.
With the image description from op0, invoke a function to create an image. Use the provided generate_image_consistent function to create the image, using the image description in op0 from the output JSON as the required prompt parameter to provided generate_image_consistent function. After you have all the required data, make an explicit call to the generate_image_consistent always, do not memorize previous calls. For each run, one and only one generate_image_consistent must be called. For example given input 'Time hook: Swimming, Place: Atlantic Ocean, Role: Rex Pickleton, Club: Chips in a Pickle' and an op0 of `The image depicts Rex Pickleton, a tenacious and nimble merman, diving gracefully into the azure depths of the Atlantic Ocean. His scales shimmer in hues of emerald and cobalt, reflecting the sun’s rays filtering through the water. His expression is focused yet excited, anticipating the adventure that lies ahead as he searches for club treasures.` call function generate_image_consistent('The image depicts Rex Pickleton, a tenacious and nimble merman, diving gracefully into the azure depths of the Atlantic Ocean. His scales shimmer in hues of emerald and cobalt, reflecting the sun’s rays filtering through the water. His expression is focused yet excited, anticipating the adventure that lies ahead as he searches for club treasures.')
```
