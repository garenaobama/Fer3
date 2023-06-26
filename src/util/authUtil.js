// export async function createTokens(id, email, role, name) {
//     const dataSign = { id, email, role, name };
//     const accessToken = await this.jwtService.sign(
//         { ...dataSign },
//         {
//             expiresIn: access_token_time,
//             secret: this.configService.get('ACCESS_TOKEN_SECRET'),
//         }
//     );
//     const refreshToken = await this.jwtService.sign(
//         { ...dataSign, accessToken },
//         {
//             expiresIn: refressh_token_time,
//             secret: this.configService.get('REFRESH_TOKEN_SECRET'),
//         }
//     );

//     return {
//         accessToken,
//         refreshToken,
//     };
// }
