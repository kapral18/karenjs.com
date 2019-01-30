import React from "react";
import { Location } from "@reach/router";
import {
    TwitterShareButton,
    TwitterIcon,
    EmailShareButton,
    EmailIcon,
    RedditShareButton,
    RedditIcon,
    TelegramShareButton,
    TelegramIcon,
    LinkedinShareButton,
    LinkedinIcon,
    WhatsappShareButton,
    WhatsappIcon
} from "react-share";
import styled from "styled-components";

const Container = styled.div`
    margin: 1rem 0 5rem;

    .social-icon {
        display: inline-block;
        margin: 0 1rem 0 0;
        cursor: pointer;
    }
`;

const Share = ({ post }) => {
    return (
        <Container>
            <p
                css={`
                    font-size: 1.4rem;
                    color: rgb(0, 0, 0);
                `}
            >
                Share if you liked it:
            </p>

            <Location>
                {({ location: { href: url } }) => {
                    const callToRead = `Read ${post.title} by ${post.author}`;

                    return (
                        <>
                            <TwitterShareButton
                                url={url}
                                title={callToRead}
                                via="kaafury"
                                hashtags={post.hashtags}
                                className="social-icon"
                            >
                                <TwitterIcon size={28} round />
                            </TwitterShareButton>
                            <RedditShareButton
                                url={url}
                                title={callToRead}
                                className="social-icon"
                            >
                                <RedditIcon size={28} round />
                            </RedditShareButton>
                            <LinkedinShareButton
                                url={url}
                                title={post.title}
                                description={callToRead}
                                className="social-icon"
                            >
                                <LinkedinIcon size={28} round />
                            </LinkedinShareButton>
                            <TelegramShareButton
                                url={url}
                                title={callToRead}
                                className="social-icon"
                            >
                                <TelegramIcon size={28} round />
                            </TelegramShareButton>
                            <WhatsappShareButton
                                url={url}
                                title={callToRead}
                                className="social-icon"
                            >
                                <WhatsappIcon size={28} round />
                            </WhatsappShareButton>
                            <EmailShareButton
                                url={url}
                                subject={callToRead}
                                body={`${post.excerpt}
                                        Read more at ${url}
                                    `}
                                className="social-icon"
                            >
                                <EmailIcon size={28} round />
                            </EmailShareButton>
                        </>
                    );
                }}
            </Location>
        </Container>
    );
};

export default Share;
