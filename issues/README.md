## Account Linking Issue

**Issue: Skill would not link with other Mercedes Developer accounts.**

After looking at the skill logs, I found the *immediate issue* to pertain to the vehicle ID. I had stored the vehicle ID associated with my developer account as an environment variable resulting in the following error:

```
{
  reason: "Token does not match with vehicle",
  code: 400,
}
```

An immediate fix for this problem would have been to query the Connected Car API for a user's vehicle ID after successful authorization.

However, there would still have been issues with the skill due to how I implemented the Oauth2 flow. 

Initially, I had trouble setting up Account Linking in the Alexa Skill developer console. I would get the error below with no visibility into where the error had occured.

![Account Linking Error](../images/accountLinkingError.jpg)

To get around this issue and more control over the Oauth2 authorization flow process, I created and hosted the `oauthServer.js` Express server to handle obtaining authorization codes and exchanging for access/refresh tokens.

I was able to get access to the tokens using this method and set up a Redis cache to store tokens and update them when they expired. However, **I was not able to get access to a user's Amazon UUID inside of my oauthServer** which prevented me from storing tokens for different users. To proceed with the assignment and time constraints, I used a single user ID for my account to continue developing the skill.

To solve this issue upstream, I re-evaluated the default Account Linking process in the Alexa Skill developer console and was able to find the issue (Client Authentication Scheme parameter).

I have created a new branch **updatedAccountLinking** which contains the refactored code and solution to this issue.